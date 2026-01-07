import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, Clock, HelpCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "문의하기 | MoneyAlim",
    description: "MoneyAlim 서비스에 대한 문의사항이 있으시면 언제든지 연락주세요.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-300">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-32">
                {/* 헤더 */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">문의하기</h1>
                    <p className="text-lg text-slate-400">
                        서비스 이용 중 궁금한 점이 있으시면<br className="sm:hidden" /> 언제든지 문의해주세요.
                    </p>
                </div>

                {/* 문의 방법 */}
                <section className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 이메일 문의 */}
                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/5 text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">이메일 문의</h2>
                            <p className="text-slate-400 text-sm mb-4">
                                서비스 관련 문의, 제휴 문의, 데이터 오류 제보 등
                            </p>
                            <a
                                href="mailto:moson6353@naver.com"
                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                moson6353@naver.com
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        {/* 응답 안내 */}
                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/5 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">응답 안내</h2>
                            <p className="text-slate-400 text-sm mb-4">
                                문의 주신 내용은 순차적으로 확인 후<br />답변 드리고 있습니다.
                            </p>
                            <span className="text-emerald-400 font-medium">
                                평일 기준 1~3일 내 답변
                            </span>
                        </div>
                    </div>
                </section>

                {/* 자주 묻는 질문 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <HelpCircle className="w-6 h-6 text-purple-400" />
                        자주 묻는 질문 (FAQ)
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "MoneyAlim은 무료인가요?",
                                a: "네, 완전히 무료입니다. 지원금 검색 및 정보 열람에 어떠한 비용도 청구하지 않습니다."
                            },
                            {
                                q: "제공되는 정보는 정확한가요?",
                                a: "공공데이터포털과 정부24의 공식 API를 통해 데이터를 제공받고 있습니다. 다만 정부 정책 변경으로 인해 실제 내용과 다를 수 있으니, 정확한 신청 조건은 해당 기관에 문의하시기 바랍니다."
                            },
                            {
                                q: "지원금 신청은 어떻게 하나요?",
                                a: "각 지원금 상세 페이지에서 '정부24에서 신청하기' 또는 '공식 홈페이지' 버튼을 클릭하시면 해당 기관의 신청 페이지로 이동합니다."
                            },
                            {
                                q: "원하는 지원금이 검색되지 않아요.",
                                a: "검색어를 조금 더 넓게 설정해보세요. 예를 들어 '청년 월세'보다 '월세'로 검색하면 더 많은 결과가 나올 수 있습니다. 그래도 찾지 못하시면 저희에게 문의 주세요!"
                            },
                            {
                                q: "데이터에 오류가 있는 것 같아요.",
                                a: "데이터 오류를 발견하시면 이메일로 알려주세요. 확인 후 빠르게 수정하겠습니다."
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800/30 rounded-xl p-6 border border-white/5">
                                <h3 className="text-white font-semibold mb-3 flex items-start gap-2">
                                    <span className="text-blue-400">Q.</span>
                                    {item.q}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed pl-6">
                                    <span className="text-emerald-400 font-medium">A.</span> {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 추가 안내 */}
                <section>
                    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/20 text-center">
                        <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-3">
                            더 궁금한 점이 있으신가요?
                        </h2>
                        <p className="text-slate-400 mb-6 text-sm">
                            FAQ에서 해결되지 않은 문의사항은<br />
                            이메일로 보내주시면 성심껏 답변드리겠습니다.
                        </p>
                        <div className="relative inline-block group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <a
                                href="mailto:moson6353@naver.com"
                                className="relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 ring-1 ring-white/10 rounded-xl leading-none"
                            >
                                <Mail className="w-6 h-6 text-purple-400 animate-pulse" />
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                    moson6353@naver.com
                                </span>
                            </a>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
