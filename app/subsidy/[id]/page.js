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

    // 다양한 구분자로 분리
    const items = text
        .split(/[○●·\-\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 5); // 너무 짧은 항목 제거

    return items.slice(0, 10); // 최대 10개
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

    const items = text
        .split(/[○●·\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 3);

    return items.slice(0, 8);
}

import RelatedSubsidies from "@/components/RelatedSubsidies";
import AdSense from "@/components/AdSense";
import KakaoShareButton from "@/components/KakaoShareButton";

// ... (other imports)

export default async function SubsidyDetail({ params }) {
    const { id } = await params;
    const subsidy = await getSubsidy(id);

    // 데이터가 없을 때
    if (!subsidy) {
        return (
            <main className="min-h-screen bg-[#0f172a] pb-20">
                <Navbar />
                <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                    <Link href="/search" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        목록으로 돌아가기
                    </Link>
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">지원금 정보를 찾을 수 없습니다.</p>
                    </div>
                </div>
            </main>
        );
    }

    // 추천 데이터 가져오기
    const relatedSubsidies = await getRelatedSubsidies(subsidy.serviceId, subsidy.category);

    const deadline = extractDeadline(subsidy.period);
    const processedCategory = mapCategory(subsidy.category);
    const requirements = parseToList(subsidy.requirements);
    const applicationMethods = parseToList(subsidy.applicationMethod);
    const requiredDocs = parseToList(subsidy.requiredDocs);
    const amountDetails = parseAmountInfo(subsidy.fullDescription);

    // 링크 우선순위: 온라인신청 > 상세URL > 정부24(ID기반)
    // DB에 저장된 gov24Url이 예전 형식일 수 있으므로, serviceId가 있으면 항상 최신 형식으로 재생성
    const correctGov24Url = subsidy.serviceId ? `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${subsidy.serviceId}` : null;
    const primaryLink = subsidy.serviceUrl || subsidy.url || correctGov24Url;
    const isGov24Link = !subsidy.serviceUrl && !subsidy.url; // ID기반 링크만 있는 경우

    // 네이버 검색 URL 생성 (DB에서 가져온 경우를 위해)
    const naverSearchUrl = subsidy.naverSearchUrl || (subsidy.title ? `https://search.naver.com/search.naver?query=${encodeURIComponent(subsidy.title + ' 신청')}` : null);
    const googleSearchUrl = subsidy.searchUrl || (subsidy.title ? `https://www.google.com/search?q=${encodeURIComponent(subsidy.title + ' 신청')}` : null);

    return (
        <main className="min-h-screen bg-[#0f172a] pb-20">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <Link href="/search" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    목록으로 돌아가기
                </Link>

                {/* 상단 광고 (Billboard) */}
                <AdSense slot="SUB_TOP" style={{ display: "block", minHeight: "100px" }} />

                <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 sm:p-10 border-b border-white/5 bg-gradient-to-br from-slate-800 via-slate-800 to-blue-900/20 relative overflow-hidden">
                        {/* 배경 패턴 */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            {/* 상태 배지 */}
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                                    {processedCategory}
                                </span>

                                {deadline.isExpired ? (
                                    <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/25">
                                        마감됨
                                    </span>
                                ) : deadline.isUrgent ? (
                                    <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-500/15 text-red-400 border border-red-500/25 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        마감임박
                                    </span>
                                ) : (
                                    <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                                        접수중
                                    </span>
                                )}

                                {subsidy.region && subsidy.region !== "전국" && (
                                    <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700/50 text-slate-300 border border-white/5">
                                        {subsidy.region}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-5 leading-tight">
                                {subsidy.title}
                            </h1>

                            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                                {subsidy.description || "상세 내용을 확인해주세요."}
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 sm:p-10 space-y-8">
                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-slate-900/50 p-5 rounded-xl border border-white/5 hover:border-blue-500/20 transition-colors">
                                <div className="flex items-center gap-2 text-slate-400 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <span className="font-medium text-sm">지원 대상</span>
                                </div>
                                <div className="text-white text-sm leading-relaxed">
                                    {summarizeTarget(subsidy.target)}
                                </div>
                            </div>

                            <div className="bg-slate-900/50 p-5 rounded-xl border border-white/5 hover:border-blue-500/20 transition-colors">
                                <div className="flex items-center gap-2 text-slate-400 mb-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${deadline.isUrgent ? 'bg-red-500/10' : 'bg-blue-500/10'
                                        }`}>
                                        {deadline.isUrgent ? (
                                            <Clock className="w-4 h-4 text-red-400" />
                                        ) : (
                                            <Calendar className="w-4 h-4 text-blue-400" />
                                        )}
                                    </div>
                                    <span className="font-medium text-sm">신청 기간</span>
                                </div>
                                <div className={`text-sm leading-relaxed ${deadline.isUrgent ? 'text-red-400 font-semibold' : 'text-white'
                                    }`}>
                                    {deadline.dDay !== null && deadline.dDay >= 0
                                        ? `D-${deadline.dDay} (${deadline.display})`
                                        : deadline.display
                                    }
                                </div>
                            </div>

                            <div className="bg-slate-900/50 p-5 rounded-xl border border-white/5 hover:border-blue-500/20 transition-colors sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center gap-2 text-slate-400 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="font-medium text-sm">담당 기관</span>
                                </div>
                                <div className="text-white text-sm leading-relaxed">
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

                        {/* 지원 내용 */}
                        {amountDetails.length > 0 && (
                            <section className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 p-6 rounded-xl border border-emerald-500/10">
                                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                        <Coins className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    지원 내용
                                </h3>
                                <ul className="space-y-3">
                                    {amountDetails.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* 지원 대상 상세 */}
                        {subsidy.target && (
                            <section>
                                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-purple-400" />
                                    </div>
                                    지원 대상 (상세)
                                </h3>
                                <div className="bg-slate-900/30 p-5 rounded-xl border border-white/5">
                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {subsidy.target}
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* 선정 기준 / 자격 요건 */}
                        {requirements.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-blue-400" />
                                    </div>
                                    선정 기준 및 자격 요건
                                </h3>
                                <ul className="space-y-3">
                                    {requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed bg-slate-900/30 p-4 rounded-lg border border-white/5">
                                            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* 신청 방법 */}
                        {applicationMethods.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                                        <ClipboardList className="w-5 h-5 text-orange-400" />
                                    </div>
                                    신청 방법
                                </h3>
                                <ul className="space-y-3">
                                    {applicationMethods.map((method, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                                            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            <span>{method}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* 구비 서류 */}
                        {requiredDocs.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    구비 서류
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {requiredDocs.map((doc, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-gray-300 text-sm bg-slate-900/30 p-3 rounded-lg border border-white/5">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0"></div>
                                            <span>{doc}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 문의처 */}
                        {subsidy.contactInfo && (
                            <section className="bg-slate-900/30 p-5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-sm">문의처</span>
                                        <p className="text-white font-medium">{subsidy.contactInfo}</p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Footer Action - 바로가기 링크들 */}
                    <div className="p-6 sm:p-10 bg-slate-900/80 border-t border-white/5 space-y-4">
                        {/* 메인 액션 버튼 */}
                        <a
                            href={primaryLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="w-5 h-5" />
                            {subsidy.serviceUrl ? '온라인 신청하기' : '상세 정보 확인하기'}
                        </a>

                        {/* 보조 버튼들 */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* 네이버 검색 */}
                            {naverSearchUrl && (
                                <a
                                    href={naverSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-[#03C75A] hover:bg-[#02b351] text-white py-3 rounded-xl font-medium transition-colors border border-white/10 flex items-center justify-center gap-2"
                                >
                                    <span className="font-black text-lg">N</span>
                                    네이버로 검색하기
                                </a>
                            )}

                            {/* 구글 검색 */}
                            {googleSearchUrl && (
                                <a
                                    href={googleSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-colors border border-white/10 flex items-center justify-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    구글로 검색하기
                                </a>
                            )}

                            <ShareButton title={subsidy.title} description={subsidy.description} />

                            {/* 카카오톡 공유 (한국 필수 기능) */}
                            <KakaoShareButton
                                title={subsidy.title}
                                description={subsidy.description}
                                imageUrl={null} // 기본 이미지 사용
                            />
                        </div>

                        {/* 안내 메시지 - 링크가 불안정할 수 있음을 안내 */}
                        <div className="text-center space-y-1 mt-2">
                            <p className="text-slate-500 text-xs">
                                💡 {subsidy.serviceUrl ? '공식 신청 페이지로 이동합니다.' : '정부 공식 데이터에 등록된 상세 페이지로 이동합니다.'}
                            </p>
                            {isGov24Link && (
                                <p className="text-orange-400/80 text-xs text-balance">
                                    ⚠️ 연결된 페이지가 없거나 만료된 경우, <strong>'네이버로 검색하기'</strong>를 이용해주세요.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 광고 (Multiplex) */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <AdSense slot="SUB_BOT" format="autorelaxed" />
            </div>

            <RelatedSubsidies subsidies={relatedSubsidies} />

            <Footer />
        </main>
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
