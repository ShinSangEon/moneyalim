import { prisma, SUBSIDY_LIST_SELECT, getNotExpiredCondition } from '@/lib/prisma';
import axios from 'axios';
import { getKeywordsForCategory, FILTER_REGIONS } from '@/lib/utils';

// 만료 여부 확인 헬퍼 함수
function parseEndDateFromPeriod(periodText) {
    if (!periodText) return null;
    if (periodText.includes('상시') || periodText.includes('연중') || periodText.includes('수시')) {
        return null;
    }

    const datePatterns = [
        /(\d{4})[.\-년]\s*(\d{1,2})[.\-월]\s*(\d{1,2})일?/g,
    ];

    const dates = [];
    for (const pattern of datePatterns) {
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        while ((match = regex.exec(periodText)) !== null) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            const day = match[3] ? parseInt(match[3]) : 28;
            if (year >= 2020 && year <= 2030) {
                dates.push(new Date(year, month, day));
            }
        }
    }

    return dates.length > 0 ? dates.sort((a, b) => b - a)[0] : null;
}

function isExpiredPeriod(periodText) {
    const endDate = parseEndDateFromPeriod(periodText);
    if (!endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
}

// DB에 데이터가 없을 때 API에서 직접 가져오기 (fallback)
async function fetchFromAPIDirectly({ search = null, category = null, region = null } = {}) {
    const BASE_URL = 'https://api.odcloud.kr/api';
    const API_KEY = process.env.SUBSIDY_API_KEY;

    try {
        const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
            params: {
                page: 1,
                perPage: 100,
                serviceKey: API_KEY,
            },
        });

        const services = response.data?.data || [];

        // 1. 기본 매핑
        const mappedServices = services
            .filter(service => !isExpiredPeriod(service.신청기한내용 || service.신청기한))
            .map(service => {
                const serviceId = service.서비스ID || '';
                const serviceName = service.서비스명 || '';

                return {
                    id: serviceId || `temp-${Math.random()}`,
                    serviceId: serviceId,
                    title: serviceName || '제목 없음',
                    description: service.서비스목적요약 || service.지원내용 || '',
                    category: service.소관기관명 || '기타',
                    target: service.지원대상 || '전국민',
                    region: service.지역구분 || '전국',
                    amount: service.지원내용 || '금액 미정',
                    period: service.신청기한내용 || service.신청기한 || '상시신청',
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
            });

        // 2. 메모리 필터링
        return mappedServices.filter(item => {
            // 검색어 필터
            if (search) {
                const searchLower = search.toLowerCase();
                const matchTitle = item.title?.toLowerCase().includes(searchLower);
                const matchDesc = item.description?.toLowerCase().includes(searchLower);
                const matchTarget = item.target?.toLowerCase().includes(searchLower);
                if (!matchTitle && !matchDesc && !matchTarget) return false;
            }

            // 카테고리 필터
            if (category && category !== '전체') {
                const keywords = getKeywordsForCategory(category);
                if (keywords.length > 0) {
                    // 키워드 중 하나라도 포함되면 통과
                    const matchKeyword = keywords.some(k => item.category?.includes(k));
                    if (!matchKeyword) return false;
                } else {
                    if (!item.category?.includes(category)) return false;
                }
            }

            // 지역 필터
            if (region && region !== '전체') {
                if (!item.region?.includes(region)) return false;
            }

            return true;
        });

    } catch (error) {
        console.error('API 직접 호출 실패:', error);
        return [];
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const region = searchParams.get('region');
    const ageYear = searchParams.get('age');
    const gender = searchParams.get('gender');
    const status = searchParams.get('status');

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    // 재사용 가능한 만료 조건
    const notExpiredCondition = getNotExpiredCondition();

    try {
        // 검색어 통계 저장 (비동기로 처리하여 응답 블로킹 방지)
        if (search && search.trim().length >= 2) {
            const term = search.trim();
            prisma.searchTerm.upsert({
                where: { term: term },
                update: { count: { increment: 1 } },
                create: { term: term, count: 1 },
            }).catch(() => {}); // 실패해도 무시
        }

        // 특정 ID 조회
        if (id) {
            const subsidy = await prisma.subsidy.findFirst({
                where: {
                    AND: [
                        {
                            OR: [
                                { id: id },
                                { serviceId: id },
                            ],
                        },
                        notExpiredCondition,
                    ],
                },
            });

            if (subsidy) {
                // 조회수 증가 (비동기로 처리하여 응답 블로킹 방지)
                prisma.subsidy.update({
                    where: { id: subsidy.id },
                    data: { views: { increment: 1 } },
                }).catch(() => {}); // 실패해도 무시

                return Response.json({
                    success: true,
                    data: subsidy,
                    source: 'database',
                });
            }

            // DB에 없으면 API에서 직접 가져오기 (fallback)
            const apiData = await fetchFromAPIDirectly({ search: null, category: null, region: null });
            const found = apiData.find(s => s.serviceId === id || s.id === id);
            if (found) {
                return Response.json({ success: true, data: found, source: 'api' });
            }

            return Response.json(
                { success: false, error: '지원금을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 목록 조회 (필터링 지원)
        const where = {
            AND: [notExpiredCondition],
        };

        // 1. 검색어
        if (search) {
            where.AND.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { target: { contains: search, mode: 'insensitive' } },
                ],
            });
        }

        // 2. 카테고리
        if (category && category !== '전체') {
            const keywords = getKeywordsForCategory(category);
            if (keywords.length > 0) {
                where.AND.push({
                    OR: keywords.map(k => ({ category: { contains: k } }))
                });
            } else {
                where.AND.push({ category: { contains: category } });
            }
        }

        // 3. 지역
        if (region && region !== '전체') {
            if (region === '전국') {
                where.AND.push({
                    OR: [
                        { region: '전국' },
                        { region: null }
                    ]
                });
            } else {
                // 지역 이형태 매핑 (검색 제외용)
                const REGION_ALIASES = {
                    "충북": ["충청북"],
                    "충남": ["충청남"],
                    "전북": ["전라북"],
                    "전남": ["전라남"],
                    "경북": ["경상북"],
                    "경남": ["경상남"],
                    "강원": ["강원"], // 강원도, 강원특별자치도 등 포함됨
                };

                // 다른 지역 필터링 (해당 지역 + 전국 데이터 포함하되, 다른 지역 명시된 것 제외)
                const otherRegions = FILTER_REGIONS
                    .filter(r => r.value !== '전체' && r.value !== '전국' && r.value !== region);

                // 제외할 키워드 목록 생성 (기본 지역명 + 이형태)
                const excludeKeywords = [];
                otherRegions.forEach(r => {
                    excludeKeywords.push(r.value);
                    if (REGION_ALIASES[r.value]) {
                        excludeKeywords.push(...REGION_ALIASES[r.value]);
                    }
                });

                where.AND.push({
                    OR: [
                        { region: { contains: region } }, // 1. 명시적으로 해당 지역인 경우
                        {
                            AND: [
                                { OR: [{ region: '전국' }, { region: null }] }, // 2. 전국 또는 지역 미정인 경우
                                {
                                    // 다른 지역명이 카테고리(소관기관)에 포함되지 않아야 함
                                    NOT: {
                                        OR: excludeKeywords.map(k => ({ category: { contains: k } }))
                                    }
                                }
                            ]
                        }
                    ]
                });
            }
        }

        // 4. 나이 필터
        if (ageYear) {
            const currentYear = new Date().getFullYear();
            const age = currentYear - parseInt(ageYear) + 1;

            const ageKeywords = [`${age}세`]; // 정확한 나이 매칭

            if (age >= 19 && age <= 34) {
                ageKeywords.push("청년", "대학생", "20대", "30대");
            } else if (age >= 65) {
                ageKeywords.push("노인", "어르신", "65세", "고령자");
            } else if (age < 19) {
                ageKeywords.push("아동", "청소년", "학생", "영유아");
            } else if (age >= 40 && age < 65) {
                ageKeywords.push("중장년", "40대", "50대");
            }

            if (ageKeywords.length > 0) {
                where.AND.push({
                    OR: [
                        { target: { contains: "전국민" } },
                        ...ageKeywords.map(k => ({ target: { contains: k } }))
                    ]
                });
            }
        }

        // 5. 성별 필터
        if (gender) {
            if (gender === '여자') {
                where.AND.push({
                    OR: [
                        { target: { contains: "여성" } },
                        { target: { contains: "임신" } },
                        { target: { contains: "출산" } },
                        { target: { contains: "모성" } },
                        { target: { contains: "전국민" } },
                    ]
                });
            } else if (gender === '남자') {
                where.AND.push({
                    OR: [
                        { target: { contains: "남성" } },
                        { target: { contains: "군인" } },
                        { target: { contains: "전국민" } },
                    ]
                });
            }
        }

        // 6. 상황/특성 필터
        if (status && status !== '전체') {
            const statusMap = {
                "학생": ["학생", "대학생", "학교", "장학"],
                "구직자": ["구직", "취업", "미취업", "실업"],
                "근로자": ["근로자", "직장인", "재직자"],
                "소상공인": ["소상공인", "자영업", "상인"],
                "농어민": ["농업", "어업", "농민", "귀농"],
                "저소득층": ["저소득", "기초생활", "차상위", "생계급여"],
                "임신출산": ["임신", "출산", "육아", "난임", "양육"],
                "장애인": ["장애인", "재활"],
                "보훈대상": ["보훈", "유공자"],
                "다문화": ["다문화", "외국인"],
            };

            const keywords = statusMap[status] || [];
            if (keywords.length > 0) {
                where.AND.push({
                    OR: keywords.map(k => ({ target: { contains: k } }))
                });
            }
        }

        // 병렬로 count와 findMany 실행 (DB 연결 최적화)
        const [totalCount, subsidies] = await Promise.all([
            prisma.subsidy.count({ where }),
            prisma.subsidy.findMany({
                where,
                select: SUBSIDY_LIST_SELECT, // 필요한 필드만 조회 (대용량 Text 제외)
                orderBy: [
                    { endDate: 'asc' },
                    { updatedAt: 'desc' },
                ],
                skip: (page - 1) * limit,
                take: limit,
            })
        ]);

        // 마지막 동기화 정보 (첫 페이지에서만 조회하여 불필요한 쿼리 방지)
        let lastSyncedAt = null;
        if (page === 1) {
            const lastSync = await prisma.syncLog.findFirst({
                select: { syncedAt: true },
                orderBy: { syncedAt: 'desc' },
                where: { status: 'success' },
            });
            lastSyncedAt = lastSync?.syncedAt || null;
        }

        return Response.json({
            success: true,
            count: subsidies.length,
            totalCount: totalCount,
            page: page,
            totalPages: Math.ceil(totalCount / limit),
            data: subsidies,
            source: 'database',
            lastSyncedAt,
        });

    } catch (error) {
        console.error('API Error:', error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
