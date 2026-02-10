import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import { ExternalLink, DollarSign, CreditCard, ShieldCheck, Phone, Car, Building } from "lucide-react";

// 환급처 데이터
const REFUND_SERVICES = [
    {
        id: "tax",
        title: "국세환급금 (잠자는 세금)",
        description: "원천징수로 떼인 세금 중 더 낸 돈을 돌려받으세요. 5년간 찾아가지 않은 미수령 환급금이 매년 수천억 원에 달합니다.",
        icon: DollarSign,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        link: "https://www.hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index.xml",
        buttonText: "국세청 홈택스 조회"
    },
    {
        id: "card",
        title: "카드 포인트 통합조회",
        description: "여러 카드사에 흩어져 소멸 예정인 포인트를 한 번에 조회하고, 현금으로 즉시 입금받을 수 있습니다.",
        icon: CreditCard,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        link: "https://www.cardpoint.or.kr/",
        buttonText: "계좌로 입금 받기"
    },
    {
        id: "insurance",
        title: "내 보험 찾아줌 (미청구 보험금)",
        description: "가입 사실을 잊었거나 연락 두절로 지급되지 않은 '숨은 보험금'을 한눈에 확인하고 청구하세요.",
        icon: ShieldCheck,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        link: "https://cont.insure.or.kr/cont_web/intro.do",
        buttonText: "내 보험금 찾기"
    },
    {
        id: "telecom",
        title: "통신비 미환급금 조회",
        description: "번호이동이나 해지 과정에서 발생한 과납 요금이나 보증금 등 돌려받지 못한 통신비를 확인해보세요.",
        icon: Phone,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        link: "https://www.smartchoice.or.kr/",
        buttonText: "스마트초이스 조회"
    },
    {
        id: "local-tax",
        title: "지방세 환급금",
        description: "자동차세 연납 후 폐차/양도했거나, 지방소득세 정산 과정에서 발생한 지방세 과오납금을 돌려드립니다.",
        icon: Building,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
        link: "https://www.wetax.go.kr/",
        buttonText: "위택스 환급 신청"
    },
    {
        id: "car-bond",
        title: "자동차 채권 미환급금",
        description: "차를 살 때 의무적으로 샀던 채권, 만기가 지났는데 잊고 계신가요? 수십만 원이 계좌에서 잠자고 있을 수 있습니다.",
        icon: Car,
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20",
        link: "https://www.ksd.or.kr/",
        buttonText: "미환급 채권 조회"
    }
];

export const metadata = {
    title: "숨은 내 돈 찾기 - 환급금 모음 | MoneyAlim",
    description: "국세환급금, 카드포인트, 미청구 보험금, 통신비 미환급금 등 잠자고 있는 내 돈을 3분 만에 찾아보세요.",
    openGraph: {
        title: "숨은 내 돈 찾기 | MoneyAlim",
        description: "국세환급금, 카드포인트, 보험금 등 잠자는 내 돈을 3분 만에 찾으세요.",
        url: "https://moneyalim.com/refund",
        type: "website",
    },
};

export default function RefundPage() {
    return (
        <main className="min-h-screen bg-[#0f172a] text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-6 shadow-lg shadow-orange-500/20">
                        <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-orange-400">
                            잠자는 내 돈
                        </span>
                        , 3분 만에 찾아가세요
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        나도 모르게 쌓여있는 환급금과 포인트,
                        <br className="hidden sm:block" />
                        그냥 두면 <strong>국고로 환수</strong>되거나 <strong>소멸</strong>됩니다. 지금 바로 조회해보세요!
                    </p>
                </div>

                {/* 상단 광고 */}
                <div className="mb-12">
                    <AdSense slot="REFUND_TOP" />
                </div>

                {/* 환급 서비스 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {REFUND_SERVICES.map((service, index) => (
                        <div
                            key={service.id}
                            className={`group relative overflow-hidden rounded-2xl border ${service.borderColor} bg-slate-800/50 p-6 hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 animate-fade-in-up`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <service.icon className={`w-6 h-6 ${service.color}`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>

                            <a
                                href={service.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all group-hover:shadow-lg border border-white/5 group-hover:border-transparent"
                            >
                                <span>{service.buttonText}</span>
                                <ExternalLink className="w-4 h-4 opacity-70" />
                            </a>
                        </div>
                    ))}
                </div>

                {/* 중간 배너형 광고 */}
                <div className="my-12">
                    <AdSense slot="REFUND_MID" format="fluid" layoutKey="-fb+5w+4e-db+86" />
                </div>

                {/* 팁 섹션 */}
                <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-8 text-center">
                    <h3 className="text-2xl font-bold mb-6 text-white">💡 환급금 조회 꿀팁</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                        <div className="space-y-2">
                            <span className="text-yellow-400 font-bold text-lg">01. 통합 조회</span>
                            <p className="text-slate-400 text-sm">
                                '정부24'를 이용하면 여러 기관의 미환급금을 한 번에 조회할 수도 있지만,
                                상세 내역 확인과 신청은 각 개별 사이트가 가장 빠릅니다.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-yellow-400 font-bold text-lg">02. 본인 인증</span>
                            <p className="text-slate-400 text-sm">
                                돈과 관련된 정보이므로 <strong>공동인증서</strong>나 <strong>휴대폰 본인인증</strong>이 필수입니다.
                                미리 준비해두시면 3분 안에 끝납니다.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-yellow-400 font-bold text-lg">03. 소멸 시효</span>
                            <p className="text-slate-400 text-sm">
                                대부분의 환급금과 포인트는 <strong>3년~5년이 지나면 법적으로 소멸</strong>되어 국가나 카드사 귀속됩니다.
                                생각날 때 조회하는 것이 이득입니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 하단 광고 */}
                <div className="mt-12">
                    <AdSense slot="REFUND_BOT" format="autorelaxed" />
                </div>
            </div>

            <Footer />
        </main>
    );
}
