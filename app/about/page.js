import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Target, Shield, Users, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "서비스 소개 | MoneyAlim - 정부지원금 맞춤 검색",
    description: "MoneyAlim은 흩어져 있는 정부 지원금 정보를 한 곳에서 쉽게 찾을 수 있도록 만든 서비스입니다. 복잡한 조건 없이 나에게 맞는 지원금을 찾아보세요.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-300">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-32">
                {/* 헤더 섹션 */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                            MoneyAlim
                        </span>
                        <span className="block text-2xl md:text-3xl mt-2 text-slate-300 font-normal">
                            정부지원금 맞춤 검색 서비스
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        지역별·대상별로 흩어져 있는 정부 지원금 정보를<br className="hidden sm:block" />
                        한 번에 찾을 수 있도록 만든 서비스입니다.
                    </p>
                </div>

                {/* 서비스 소개 */}
                <section className="mb-16">
                    <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-blue-400" />
                            왜 MoneyAlim을 만들었나요?
                        </h2>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                대한민국에는 수천 개가 넘는 정부 지원금과 복지 혜택이 있습니다.
                                하지만 정보가 여러 기관에 흩어져 있어, 정작 받을 수 있는 혜택을
                                모르고 놓치는 분들이 많습니다.
                            </p>
                            <p>
                                <strong className="text-white">MoneyAlim</strong>은 이런 문제를 해결하기 위해 탄생했습니다.
                                공공데이터포털(data.go.kr)과 정부24의 공식 데이터를 바탕으로,
                                복잡한 조건을 쉽게 풀어서 <strong className="text-emerald-400">나에게 맞는 지원금</strong>을
                                빠르게 찾을 수 있도록 도와드립니다.
                            </p>
                            <p>
                                단순히 지원금 목록을 나열하는 것이 아니라,
                                <strong className="text-blue-400"> 실제 신청 시 주의할 점과 조건</strong>을 함께 제공하여
                                신청 성공률을 높이는 것이 우리의 목표입니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 누구를 위한 서비스인가 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <Target className="w-6 h-6 text-purple-400" />
                        이런 분들을 위한 서비스입니다
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { icon: "👨‍👩‍👧", title: "육아·출산 지원금을 찾는 부모님", desc: "출산장려금, 양육수당, 아동수당 등" },
                            { icon: "🎓", title: "학자금·장학금을 찾는 학생", desc: "국가장학금, 지역장학금, 생활비 대출 등" },
                            { icon: "💼", title: "취업·창업 지원을 찾는 청년", desc: "청년내일채움공제, 창업지원금 등" },
                            { icon: "🏠", title: "주거지원을 찾는 분", desc: "전세자금대출, 주거급여, 월세지원 등" },
                            { icon: "👴", title: "어르신 복지혜택을 찾는 분", desc: "기초연금, 노인돌봄서비스 등" },
                            { icon: "🌾", title: "농어민·소상공인", desc: "영농지원금, 소상공인 긴급지원 등" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl border border-white/5">
                                <span className="text-3xl">{item.icon}</span>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 서비스 특징 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        MoneyAlim의 특징
                    </h2>
                    <div className="space-y-4">
                        {[
                            { title: "공식 데이터 기반", desc: "공공데이터포털과 정부24의 공식 API를 통해 최신 정보를 제공합니다." },
                            { title: "맞춤 필터링", desc: "지역, 나이, 상황별로 세분화된 필터로 나에게 맞는 지원금만 확인할 수 있습니다." },
                            { title: "무료 서비스", desc: "모든 검색과 정보 열람은 무료입니다. 별도의 회원가입도 필요 없습니다." },
                            { title: "실시간 업데이트", desc: "정부 정책 변경에 맞춰 데이터를 지속적으로 업데이트합니다." },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-xl border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 운영자 정보 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Users className="w-6 h-6 text-blue-400" />
                        운영자 정보
                    </h2>
                    <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/5">
                        <div className="space-y-4 text-slate-300">
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 w-24">서비스명</span>
                                <span className="text-white font-medium">MoneyAlim (머니알림)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 w-24">운영자</span>
                                <span className="text-white">개인 운영</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 w-24">이메일</span>
                                <a href="mailto:moson6353@naver.com" className="text-blue-400 hover:underline">
                                    moson6353@naver.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 w-24">데이터 출처</span>
                                <span>공공데이터포털, 정부24</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/20">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            지금 바로 나에게 맞는 지원금을 찾아보세요
                        </h2>
                        <p className="text-slate-400 mb-6">
                            복잡한 조건 검색 없이, 클릭 몇 번이면 충분합니다.
                        </p>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
                        >
                            지원금 찾기 시작하기
                            <span>→</span>
                        </Link>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
