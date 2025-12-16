import { prisma } from '@/lib/prisma';
import axios from 'axios';

// 신청기한에서 마감일 추출
function parseEndDate(periodText) {
    if (!periodText) return null;

    // 상시, 연중, 수시 등은 마감일 없음
    if (periodText.includes('상시') || periodText.includes('연중') || periodText.includes('수시')) {
        return null; // null = 마감 없음 (상시)
    }

    // 날짜 패턴 매칭 (YYYY.MM.DD, YYYY-MM-DD, YYYY년 MM월 DD일)
    const datePatterns = [
        /(\d{4})[.\-년]\s*(\d{1,2})[.\-월]\s*(\d{1,2})일?/g,
        /(\d{4})년\s*(\d{1,2})월/g,
    ];

    const dates = [];
    for (const pattern of datePatterns) {
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        while ((match = regex.exec(periodText)) !== null) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            const day = match[3] ? parseInt(match[3]) : 28; // 일이 없으면 월말로 가정

            if (year >= 2020 && year <= 2030 && month >= 0 && month <= 11) {
                dates.push(new Date(year, month, day, 23, 59, 59));
            }
        }
    }

    // 가장 마지막 날짜를 마감일로 반환
    if (dates.length > 0) {
        return dates.sort((a, b) => b - a)[0];
    }

    return null;
}

// 만료 여부 확인
function isExpired(endDate) {
    if (!endDate) return false; // 마감일 없음 = 상시 = 만료 아님
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
}

// 공공데이터 API에서 전체 데이터 가져오기
async function fetchAllSubsidiesFromAPI() {
    const BASE_URL = 'https://api.odcloud.kr/api';
    const API_KEY = process.env.SUBSIDY_API_KEY;

    let allServices = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    console.log('📡 공공데이터 API에서 데이터 가져오기 시작...');

    while (hasMore) { // 전체 데이터 가져오기 (페이지 제한 제거)
        try {
            const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
                params: {
                    page: page,
                    perPage: perPage,
                    serviceKey: API_KEY,
                },
            });

            const services = response.data?.data || [];
            allServices = [...allServices, ...services];

            console.log(`  📄 페이지 ${page}: ${services.length}개 로드`);

            if (services.length < perPage) {
                hasMore = false;
            }

            page++;
            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.error(`페이지 ${page} 로드 실패:`, error.message);
            hasMore = false;
        }
    }

    console.log(`✅ 총 ${allServices.length}개 데이터 로드 완료`);
    return allServices;
}

// API 데이터를 DB 형식으로 변환
function transformServiceData(service) {
    const serviceId = service.서비스ID || '';
    const serviceName = service.서비스명 || '';
    const periodText = service.신청기한내용 || service.신청기한 || '';

    // 마감일 파싱
    const endDate = parseEndDate(periodText);

    // URL 생성
    const serviceUrl = service.온라인신청사이트URL || null;
    const gov24Url = serviceId ? `https://www.gov.kr/portal/service/serviceInfo/${serviceId}` : null;
    const searchUrl = serviceName ? `https://www.google.com/search?q=${encodeURIComponent(serviceName + ' 신청')}` : null;

    return {
        serviceId: serviceId,
        title: serviceName || '제목 없음',
        description: service.서비스목적요약 || null,
        category: service.소관기관명 || '기타',
        target: service.지원대상 || null,
        region: service.지역구분 || null,
        amount: service.지원내용 || null,
        period: periodText || null,
        endDate: endDate, // 마감일 추가
        fullDescription: service.지원내용 || null,
        requirements: service.선정기준내용 || null,
        applicationMethod: service.신청방법내용 || null,
        requiredDocs: service.구비서류내용 || null,
        contactInfo: service.문의처전화번호 || null,
        hostOrg: service.소관기관명 || null,
        serviceUrl: serviceUrl,
        gov24Url: gov24Url,
        searchUrl: searchUrl,
    };
}

export async function POST(request) {
    const authHeader = request.headers.get('authorization');
    const syncKey = process.env.SYNC_SECRET_KEY || 'sync-secret-123';

    if (authHeader !== `Bearer ${syncKey}`) {
        return Response.json(
            { success: false, error: '인증 실패' },
            { status: 401 }
        );
    }

    try {
        console.log('🔄 데이터 동기화 시작...');
        const startTime = Date.now();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. API에서 데이터 가져오기
        const apiServices = await fetchAllSubsidiesFromAPI();

        if (apiServices.length === 0) {
            throw new Error('API에서 데이터를 가져오지 못했습니다.');
        }

        // 2. 데이터 변환 및 필터링
        let newCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;
        let deletedCount = 0;

        const validServiceIds = [];

        for (const service of apiServices) {
            if (!service.서비스ID) continue;

            const data = transformServiceData(service);

            // 만료된 데이터는 건너뛰기
            if (isExpired(data.endDate)) {
                skippedCount++;
                console.log(`  ⏭️ 만료됨 - ${data.title} (${data.endDate?.toLocaleDateString()})`);
                continue;
            }

            validServiceIds.push(data.serviceId);

            // upsert: 있으면 업데이트, 없으면 생성
            const result = await prisma.subsidy.upsert({
                where: { serviceId: data.serviceId },
                update: {
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    target: data.target,
                    region: data.region,
                    amount: data.amount,
                    period: data.period,
                    endDate: data.endDate,
                    fullDescription: data.fullDescription,
                    requirements: data.requirements,
                    applicationMethod: data.applicationMethod,
                    requiredDocs: data.requiredDocs,
                    contactInfo: data.contactInfo,
                    hostOrg: data.hostOrg,
                    serviceUrl: data.serviceUrl,
                    gov24Url: data.gov24Url,
                    searchUrl: data.searchUrl,
                },
                create: data,
            });

            const isNew = result.createdAt.getTime() === result.updatedAt.getTime();
            if (isNew) {
                newCount++;
            } else {
                updatedCount++;
            }
        }

        // 3. DB에서 만료된 데이터 삭제
        const deleteResult = await prisma.subsidy.deleteMany({
            where: {
                AND: [
                    { endDate: { not: null } },
                    { endDate: { lt: today } },
                ],
            },
        });
        deletedCount = deleteResult.count;

        if (deletedCount > 0) {
            console.log(`  🗑️ 만료된 데이터 ${deletedCount}개 삭제됨`);
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        // 4. 동기화 로그 저장
        await prisma.syncLog.create({
            data: {
                totalCount: newCount + updatedCount,
                newCount: newCount,
                updatedCount: updatedCount,
                status: 'success',
                message: `${duration}초 소요, ${skippedCount}개 만료로 제외, ${deletedCount}개 삭제`,
            },
        });

        console.log(`✅ 동기화 완료!`);
        console.log(`   - 유효한 데이터: ${newCount + updatedCount}개`);
        console.log(`   - 신규: ${newCount}개`);
        console.log(`   - 업데이트: ${updatedCount}개`);
        console.log(`   - 만료로 제외: ${skippedCount}개`);
        console.log(`   - 삭제됨: ${deletedCount}개`);

        return Response.json({
            success: true,
            message: '데이터 동기화 완료',
            stats: {
                total: newCount + updatedCount,
                new: newCount,
                updated: updatedCount,
                skipped: skippedCount,
                deleted: deletedCount,
                duration: `${duration}초`,
            },
        });

    } catch (error) {
        console.error('❌ 동기화 실패:', error);

        try {
            await prisma.syncLog.create({
                data: {
                    totalCount: 0,
                    newCount: 0,
                    updatedCount: 0,
                    status: 'failed',
                    message: error.message,
                },
            });
        } catch (logError) {
            console.error('로그 저장 실패:', logError);
        }

        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// 동기화 상태 확인
export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 마지막 동기화 정보
        const lastSync = await prisma.syncLog.findFirst({
            orderBy: { syncedAt: 'desc' },
        });

        // 유효한 데이터 수 (만료되지 않은 것만)
        const activeSubsidies = await prisma.subsidy.count({
            where: {
                OR: [
                    { endDate: null }, // 상시
                    { endDate: { gte: today } }, // 아직 안 만료됨
                ],
            },
        });

        // 전체 데이터 수
        const totalSubsidies = await prisma.subsidy.count();

        return Response.json({
            success: true,
            data: {
                totalSubsidies,
                activeSubsidies,
                expiredCount: totalSubsidies - activeSubsidies,
                lastSync: lastSync ? {
                    syncedAt: lastSync.syncedAt,
                    totalCount: lastSync.totalCount,
                    status: lastSync.status,
                    message: lastSync.message,
                } : null,
            },
        });

    } catch (error) {
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
