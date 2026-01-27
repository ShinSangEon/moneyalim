import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import axios from "axios";

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

// 변경 사항 감지 헬퍼 함수
function hasChanged(oldData, newData) {
    if (!oldData) return true;

    // 주요 필드 비교 (필요에 따라 더 많은 필드 추가 가능)
    // 날짜 비교는 getTime() 사용
    return (
        oldData.title !== newData.title ||
        oldData.period !== newData.period ||
        oldData.location !== newData.location ||
        oldData.category !== newData.category ||
        oldData.target !== newData.target ||
        oldData.amount !== newData.amount ||
        oldData.description !== newData.description ||
        oldData.serviceUrl !== newData.serviceUrl ||
        (oldData.endDate?.getTime() !== newData.endDate?.getTime())
    );
}

// 서비스 데이터 변환 함수
function transformServiceData(service) {
    const serviceId = service.서비스ID || '';
    const serviceName = service.서비스명 || '';
    const period = service.신청기한내용 || service.신청기한 || '상시신청';
    const endDate = parseEndDate(period);

    return {
        serviceId: serviceId,
        title: serviceName || '제목 없음',
        description: service.서비스목적요약 || service.지원내용 || '',
        category: service.소관기관명 || '기타',
        target: service.지원대상 || '전국민',
        region: service.지역구분 || '전국',
        amount: service.지원내용 || '금액 미정',
        period: period,
        endDate: endDate,
        fullDescription: service.지원내용 || '',
        requirements: service.선정기준내용 || '',
        applicationMethod: service.신청방법내용 || '',
        requiredDocs: service.구비서류내용 || '',
        contactInfo: service.문의처전화번호 || '',
        hostOrg: service.소관기관명 || '',
        serviceUrl: service.온라인신청사이트URL || null,
        gov24Url: serviceId ? `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${serviceId}` : null,
        searchUrl: serviceName ? `https://www.google.com/search?q=${encodeURIComponent(serviceName + ' 신청')}` : null,
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
        console.log('🔄 데이터 동기화 시작 (최적화 모드)...');
        const startTime = Date.now();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. API 파라미터 및 변수 설정
        const BASE_URL = 'https://api.odcloud.kr/api';
        const API_KEY = process.env.SUBSIDY_API_KEY;
        const perPage = 100;
        let page = 1;
        let hasMore = true;

        let newCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;
        let deletedCount = 0;
        let totalProcessed = 0;

        // 2. 페이지 단위 루프 (Memory 효율화)
        while (hasMore) {
            try {
                // API 호출
                const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
                    params: { page, perPage, serviceKey: API_KEY },
                });

                const services = response.data?.data || [];
                if (services.length === 0) {
                    hasMore = false;
                    break;
                }

                // API 데이터 전처리 (유효한 데이터만 추출)
                const validItems = [];
                const validServiceIds = [];

                for (const service of services) {
                    if (!service.서비스ID) continue;

                    const data = transformServiceData(service);

                    // 만료된 데이터는 즉시 스킵 (DB 조회 불필요)
                    if (isExpired(data.endDate)) {
                        skippedCount++;
                        continue;
                    }

                    validItems.push(data);
                    validServiceIds.push(data.serviceId);
                }

                if (validItems.length > 0) {
                    // DB에서 기존 데이터 조회 (Change Detection용)
                    const existingRecords = await prisma.subsidy.findMany({
                        where: { serviceId: { in: validServiceIds } },
                        select: {
                            serviceId: true,
                            title: true,
                            period: true,
                            region: true,
                            category: true,
                            target: true,
                            amount: true,
                            description: true,
                            serviceUrl: true,
                            endDate: true
                        }
                    });

                    const existingMap = new Map();
                    existingRecords.forEach(r => existingMap.set(r.serviceId, r));

                    const toCreate = [];
                    const toUpdate = [];

                    for (const item of validItems) {
                        const existing = existingMap.get(item.serviceId);

                        if (!existing) {
                            toCreate.push(item);
                        } else if (hasChanged(existing, item)) {
                            toUpdate.push(item);
                        }
                        // 변경 없으면 아무것도 안 함 (Skip)
                    }

                    // 배치 실행: 신규 생성 (대량 삽입)
                    if (toCreate.length > 0) {
                        await prisma.subsidy.createMany({
                            data: toCreate,
                            skipDuplicates: true
                        });
                        newCount += toCreate.length;
                    }

                    // 배치 실행: 업데이트 (병렬 처리)
                    if (toUpdate.length > 0) {
                        await Promise.all(
                            toUpdate.map(item =>
                                prisma.subsidy.update({
                                    where: { serviceId: item.serviceId },
                                    data: {
                                        title: item.title,
                                        description: item.description,
                                        category: item.category,
                                        target: item.target,
                                        region: item.region,
                                        amount: item.amount,
                                        period: item.period,
                                        endDate: item.endDate,
                                        fullDescription: item.fullDescription,
                                        requirements: item.requirements,
                                        applicationMethod: item.applicationMethod,
                                        requiredDocs: item.requiredDocs,
                                        contactInfo: item.contactInfo,
                                        hostOrg: item.hostOrg,
                                        serviceUrl: item.serviceUrl,
                                        gov24Url: item.gov24Url,
                                        searchUrl: item.searchUrl,
                                    }
                                })
                            )
                        );
                        updatedCount += toUpdate.length;
                    }
                }

                console.log(`  📄 페이지 ${page} 처리 완료: ${validItems.length}건 유효 / ${services.length}건 중`);
                totalProcessed += services.length;
                page++;

                // 딜레이 (API 부하 방지)
                await new Promise(r => setTimeout(r, 50));

            } catch (err) {
                console.error(`페이지 ${page} 처리 중 에러:`, err.message);
                hasMore = false; // 에러 시 중단
            }
        }

        // 3. DB에서 만료된 데이터 삭제 (Cleanup)
        const deleteResult = await prisma.subsidy.deleteMany({
            where: {
                AND: [
                    { endDate: { not: null } },
                    { endDate: { lt: today } },
                ],
            },
        });
        deletedCount = deleteResult.count;

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        // 4. 로그 저장
        await prisma.syncLog.create({
            data: {
                totalCount: newCount + updatedCount,
                newCount,
                updatedCount,
                status: 'success',
                message: `최적화 동기화: ${duration}초, ${skippedCount}개 만료 제외`,
            },
        });

        console.log(`✅ 최적화 동기화 완료! (${duration}초)`);
        console.log(`   - 신규: ${newCount}, 업데이트: ${updatedCount}`);
        console.log(`   - 변경 없음(Skip): ${totalProcessed - newCount - updatedCount - skippedCount}`);
        console.log(`   - 만료 제외: ${skippedCount}, 삭제됨: ${deletedCount}`);

        // 캐시 무효화 (revalidateTag 대체)
        // revalidateTag("subsidies") 대신 path 기반 재검증 사용 권장
        // 혹은 모든 페이지 갱신
        try {
            // 메인 페이지 및 검색 페이지 갱신
            revalidateTag("subsidies");
        } catch (e) {
            console.log("Cache Revalidation warning:", e.message);
        }

        return Response.json({
            success: true,
            message: "데이터 동기화 완료",
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
        await prisma.syncLog.create({
            data: {
                totalCount: 0, newCount: 0, updatedCount: 0,
                status: 'failed', message: error.message,
            },
        });
        return Response.json({ success: false, error: error.message }, { status: 500 });
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
