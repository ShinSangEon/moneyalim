import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* 브랜드 소개 */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                                MoneyAlim
                            </span>
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-4">
                            지역별·대상별로 흩어져 있는 정부 지원금 정보를 한 번에 찾을 수 있도록 만든 서비스입니다.
                            단순 나열이 아니라, 실제 신청 시 주의할 점과 조건을 함께 제공합니다.
                        </p>
                        <p className="text-xs text-slate-500">
                            ※ 본 서비스는 공공데이터포털 및 정부24의 공식 데이터를 기반으로 제공합니다.
                        </p>
                    </div>

                    {/* 서비스 */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">서비스</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link href="/search" className="hover:text-blue-400 transition-colors">
                                    지원금 찾기
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-blue-400 transition-colors">
                                    서비스 소개
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                                    자주 묻는 질문
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 문의하기 */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">문의하기</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <a href="mailto:contact@moneyalim.com" className="hover:text-blue-400 transition-colors">
                                    contact@moneyalim.com
                                </a>
                            </li>
                            <li className="text-slate-500">평일 기준 1~3일 내 답변</li>
                        </ul>
                    </div>
                </div>

                {/* 하단 링크 */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 MoneyAlim. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/about" className="hover:text-white transition-colors">
                            서비스 소개
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            이용약관
                        </Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            개인정보처리방침
                        </Link>
                        <Link href="/contact" className="hover:text-white transition-colors">
                            문의하기
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
