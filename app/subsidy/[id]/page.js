import { cache } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    ExternalLink,
    Users,
    Building2,
    FileText,
    Phone,
    Clock,
    Coins,
    AlertCircle,
    ClipboardList,
    Search
} from "lucide-react";
import Link from "next/link";
import { extractDeadline, summarizeTarget, mapCategory } from "@/lib/utils";
import { getCachedSubsidyById, getCachedRelatedSubsidies, incrementViews } from "@/lib/prisma";
import axios from "axios";
import RelatedSubsidies from "@/components/RelatedSubsidies";
import AdSense from "@/components/AdSense";
import KakaoShareButton from "@/components/KakaoShareButton";

// React cache로 같은 요청 내에서 중복 호출 방지 (메타데이터 + 페이지)
const getSubsidy = cache(async (id) => {
    try {
        // 10분 캐싱된 데이터 사용
        const subsidy = await getCachedSubsidyById(id);

        if (subsidy) {
            // 조회수 증가 (비동기, 캐싱 안 함)
            incrementViews(subsidy.id);
            return subsidy;
        }

        return await fetchSubsidyFromAPI(id);
    } catch (error) {
        console.error("Failed to fetch subsidy:", error);
        return await fetchSubsidyFromAPI(id);
    }
});

// API에서 특정 지원금 가져오기 (fallback)
async function fetchSubsidyFromAPI(id) {
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
        const service = services.find(s => s.서비스ID === id);

        if (!service) return null;

        const serviceId = service.서비스ID || '';
        const serviceName = service.서비스명 || '';

        return {
            id: serviceId,
            serviceId: serviceId,
            title: serviceName || '제목 없음',
            description: service.서비스목적요약 || service.지원내용 || '',
            category: service.소관기관명 || '기타',
            target: service.지원대상 || '전국민',
            region: service.지역구분 || '전국',
            amount: service.지원내용 || '금액 미정',
            period: service.신청기한내용 || '상시신청',
            fullDescription: service.지원내용 || '',
            requirements: service.선정기준내용 || '',
            applicationMethod: service.신청방법내용 || '',
            requiredDocs: service.구비서류내용 || '',
            contactInfo: service.문의처전화번호 || '',
            hostOrg: service.소관기관명 || '',
            serviceUrl: service.온라인신청사이트URL || null,
            url: service.상세조회URL || null, // API에서 제공하는 상세 URL
            gov24Url: serviceId ? `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${serviceId}` : null,
            searchUrl: serviceName ? `https://www.google.com/search?q=${encodeURIComponent(serviceName + ' 신청')}` : null,
            naverSearchUrl: serviceName ? `https://search.naver.com/search.naver?query=${encodeURIComponent(serviceName + ' 신청')}` : null,
        };
    } catch (error) {
        console.error('API 호출 실패:', error);
        return null;
    }
}

// 텍스트를 리스트 항목으로 파싱
function parseToList(text) {
    if (!text) return [];

    const lines = text.split('\n');
    const items = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // 불렛포인트 제거나 단순 추가
        items.push(trimmed.replace(/^[○●·\-\*]\s*/, '').trim());
    }

    return items.filter(item => item.length > 1).slice(0, 20);
}

// 메타데이터 생성 (SEO)
export async function generateMetadata({ params }) {
    const { id } = await params;
    const subsidy = await getSubsidy(id);

    if (!subsidy) {
        return {
            title: '지원금을 찾을 수 없습니다',
            description: '요청하신 지원금 정보가 존재하지 않습니다.',
        };
    }

    const title = `${subsidy.title} - 신청방법, 자격요건 총정리`;
    const description = subsidy.description
        ? subsidy.description.substring(0, 160).replace(/\n/g, ' ') + '...'
        : `${subsidy.title}에 대한 자세한 신청 방법과 혜택을 확인하세요.`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'article',
            url: `https://moneyalim.com/subsidy/${id}`,
            images: [
                {
                    url: 'https://moneyalim.com/logo.png',
                    width: 800,
                    height: 600,
                    alt: subsidy.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: ['https://moneyalim.com/logo.png'],
        },
    };
}

// 금액/지원 내용 파싱
function parseAmountInfo(text) {
    if (!text) return [];

    // 1. 먼저 줄바꿈으로 분리
    let lines = text.split('\n');

    // 2. 각 줄이 너무 길거나, 불렛포인트가 포함된 경우 재분리
    let items = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // 불렛포인트로 시작하는 경우
        if (/^[○●·\-\*]/.test(trimmed)) {
            items.push(trimmed.replace(/^[○●·\-\*]\s*/, '').trim());
        } else {
            // 문장이 끝나는 경우 그대로 추가
            items.push(trimmed);
        }
    }

    // 3. 필터링 및 최대 개수 제한 완화 (20개)
    return items
        .filter(item => item.length > 1)
        .slice(0, 20);
}

export default async function SubsidyDetail({ params }) {
    const { id } = await params;
    const subsidy = await getSubsidy(id);

    // 데이터가 없을 때
    if (!subsidy) {
        return (
            <main className="min-h-screen bg-slate-50 pb-20">
                <Navbar />
                <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                    <Link href="/search" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors group font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        목록으로 돌아가기
                    </Link>
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                        <p className="text-slate-500 text-lg">지원금 정보를 찾을 수 없습니다.</p>
                    </div>
                </div>
            </main>
        );
    }

    // 추천 데이터 가져오기 (비동기)
    const relatedSubsidies = await getRelatedSubsidies(subsidy.serviceId, subsidy.category);

    const deadline = extractDeadline(subsidy.period);
    const processedCategory = mapCategory(subsidy.category);
    const requirements = parseToList(subsidy.requirements);
    const applicationMethods = parseToList(subsidy.applicationMethod);
    const requiredDocs = parseToList(subsidy.requiredDocs);
    const amountDetails = parseAmountInfo(subsidy.fullDescription);

    const correctGov24Url = subsidy.serviceId ? `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${subsidy.serviceId}` : null;
    const primaryLink = subsidy.serviceUrl || subsidy.url || correctGov24Url;
    const isGov24Link = !subsidy.serviceUrl && !subsidy.url;

    // 네이버 검색 URL 생성
    const naverSearchUrl = subsidy.naverSearchUrl || (subsidy.title ? `https://search.naver.com/search.naver?query=${encodeURIComponent(subsidy.title + ' 신청')}` : null);
    const googleSearchUrl = subsidy.searchUrl || (subsidy.title ? `https://www.google.com/search?q=${encodeURIComponent(subsidy.title + ' 신청')}` : null);

    // JSON-LD 구조화된 데이터 생성
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "GovernmentService",
        "name": subsidy.title,
        "description": subsidy.description || subsidy.title,
        "provider": {
            "@type": "GovernmentOrganization",
            "name": subsidy.hostOrg || subsidy.category || "정부"
        },
        "areaServed": {
            "@type": "Country",
            "name": "대한민국"
        },
        "audience": {
            "@type": "Audience",
            "audienceType": subsidy.target || "전국민"
        }
    };

    return (
        HEAD
        < main className = "min-h-screen bg-[#0f172a] pb-20" >
            {/* JSON-LD 구조화된 데이터 */ }
            < script
    type = "application/ld+json"
    dangerouslySetInnerHTML = {{ __html: JSON.stringify(jsonLd) }
}
            />

    < main className = "min-h-screen bg-slate-50 pb-20" >
>>>>>>> 8701d67b1101751b9f8a1e43ede4a3586268a0d7
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <Link href="/search" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors group font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    목록으로 돌아가기
                </Link>

                {/* 상단 광고 (Billboard) */}
                <AdSense slot="SUB_TOP" style={{ display: "block", minHeight: "100px" }} />

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Header: Product Hero Section */}
                    <div className="p-6 sm:p-10 border-b border-slate-100 relative overflow-hidden">

                        <div className="relative z-10">
                            {/* 상태 배지 */}
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                    {processedCategory}
                                </span>

                                {deadline.isExpired ? (
                                    <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                        마감됨
                                    </span>
                                ) : deadline.isUrgent ? (
                                    <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 text-red-600 border border-red-100 flex items-center gap-1 animate-pulse">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        마감임박
                                    </span>
                                ) : (
                                    <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        접수중
                                    </span>
                                )}

                                {subsidy.region && subsidy.region !== "전국" && (
                                    <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-50 text-slate-600 border border-slate-200">
                                        {subsidy.region}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                                {subsidy.title}
                            </h1>

                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                                    {subsidy.description || "상세 내용을 확인해주세요."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 sm:p-10 space-y-12">
                        {/* Summary Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-colors">
                                <div className="flex items-center gap-2 text-slate-500 mb-2">
                                    <Users className="w-4 h-4 text-purple-500" />
                                    <span className="font-bold text-xs uppercase tracking-wider">지원 대상</span>
                                </div>
                                <div className="text-slate-900 font-bold text-sm leading-snug">
                                    {summarizeTarget(subsidy.target)}
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-colors">
                                <div className="flex items-center gap-2 text-slate-500 mb-2">
                                    {deadline.isUrgent ? (
                                        <Clock className="w-4 h-4 text-red-500" />
                                    ) : (
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                    )}
                                    <span className="font-bold text-xs uppercase tracking-wider">신청 기간</span>
                                </div>
                                <div className={`font-bold text-sm leading-snug ${deadline.isUrgent ? 'text-red-600' : 'text-slate-900'}`}>
                                    {deadline.dDay !== null && deadline.dDay >= 0
                                        ? `D-${deadline.dDay} (${deadline.display})`
                                        : deadline.display
                                    }
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-colors sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center gap-2 text-slate-500 mb-2">
                                    <Building2 className="w-4 h-4 text-emerald-500" />
                                    <span className="font-bold text-xs uppercase tracking-wider">담당 기관</span>
                                </div>
                                <div className="text-slate-900 font-bold text-sm leading-snug">
                                    {subsidy.hostOrg || subsidy.category || "정부"}
                                </div>
                            </div>
                        </div>

                        {/* 중간 광고 (In-Feed) */}
                        <AdSense
                            slot="SUB_MID"
                            format="fluid"
                            layoutKey="-fb+5w+4e-db+86"
                            style={{ display: "block" }}
                        />

                        {/* 지원 내용 (Highlight Section) */}
                        {amountDetails.length > 0 && (
                            <section className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 rounded-3xl border border-blue-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-blue-100">
                                        <Coins className="w-5 h-5 text-blue-600" />
                                    </div>
                                    얼마나 받을 수 있나요?
                                </h3>
                                <ul className="space-y-4">
                                    {amountDetails.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-white/80 p-4 rounded-xl border border-blue-100/50 shadow-sm">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                            <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <div className="h-px bg-slate-100 w-full" />

                        {/* 지원 대상 상세 */}
                        {subsidy.target && (
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-slate-400" />
                                    자세한 지원 대상을 확인하세요
                                </h3>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed font-medium">
                                    {subsidy.target}
                                </div>
                            </section>
                        )}

                        {/* 선정 기준 / 자격 요건 */}
                        {requirements.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-slate-400" />
                                    선정 기준 및 자격
                                </h3>
                                <ul className="space-y-3">
                                    {requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <span className="text-slate-600 leading-relaxed">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* 신청 방법 */}
                        {applicationMethods.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-slate-400" />
                                    신청 방법
                                </h3>
                                <ul className="space-y-3">
                                    {applicationMethods.map((method, idx) => (
                                        <li key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <span className="text-slate-600 leading-relaxed">{method}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* 구비 서류 */}
                        {requiredDocs.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                    제출해야 할 서류
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {requiredDocs.map((doc, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0"></div>
                                            <span className="text-slate-600 font-medium">{doc}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 문의처 */}
                        {subsidy.contactInfo && (
                            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                        <Phone className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-sm font-medium mb-1 block">문의처</span>
                                        <p className="text-slate-900 font-bold text-lg">{subsidy.contactInfo}</p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Footer Action - Sticky on Mobile? No, just section */}
                    <div className="p-6 sm:p-10 bg-slate-50 border-t border-slate-200 space-y-4">
                        {/* 메인 액션 버튼 */}
                        <a
                            href={primaryLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="w-6 h-6" />
                            {subsidy.serviceUrl ? '지금 신청하러 가기' : '상세 정보 확인하기'}
                        </a>

                        {/* 보조 버튼들 */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* 네이버 검색 */}
                            {naverSearchUrl && (
                                <a
                                    href={naverSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-[#03C75A] hover:bg-[#02b351] text-white py-3.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <span className="font-black text-lg">N</span>
                                    네이버 검색
                                </a>
                            )}

                            {/* 구글 검색 */}
                            {googleSearchUrl && (
                                <a
                                    href={googleSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl font-bold transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Search className="w-5 h-5 text-slate-400" />
                                    구글 검색
                                </a>
                            )}

                            <ShareButton title={subsidy.title} description={subsidy.description} />

                            <KakaoShareButton
                                title={subsidy.title}
                                description={subsidy.description}
                                imageUrl={null}
                            />
                        </div>

                        {/* 안내 메시지 */}
                        <div className="text-center space-y-1 mt-4">
                            <p className="text-slate-400 text-xs">
                                💡 {subsidy.serviceUrl ? '공식 신청 페이지로 이동합니다.' : '정부 공식 데이터에 등록된 상세 페이지로 이동합니다.'}
                            </p>
                            {isGov24Link && (
                                <p className="text-orange-500/80 text-xs text-balance font-medium">
                                    ⚠️ 연결된 페이지가 없거나 만료된 경우, <strong>'네이버 검색'</strong>을 이용해주세요.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

{/* 하단 광고 */ }
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-12">
                <AdSense slot="SUB_BOT" format="autorelaxed" />
            </div>

            <RelatedSubsidies subsidies={relatedSubsidies} />

            <Footer />
        </main >
    );
}

// 관련 지원금 조회 (5분 캐싱)
const getRelatedSubsidies = cache(async (currentId, category) => {
    try {
        return await getCachedRelatedSubsidies(currentId, category);
    } catch (error) {
        return [];
    }
});
