"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* 브랜드 소개 */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                                MoneyAlim
                            </span>
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-4">
                            정부지원금, 더 이상 어렵게 찾지 마세요.<br />
                            MoneyAlim에서 쇼핑하듯 쉽고 간편하게 나만의 혜택을 발견하세요.
                        </p>
                        <p className="text-xs text-slate-400">
                            ※ 본 서비스는 공공데이터포털 및 정부24의 공식 데이터를 기반으로 제공합니다.
                        </p>
                    </div>

                    {/* 서비스 */}
                    <div>
                        <h4 className="text-slate-800 font-bold mb-4">서비스</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>
                                <Link href="/search" className="hover:text-blue-600 transition-colors">
                                    지원금 찾기
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-blue-600 transition-colors">
                                    서비스 소개
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                                    자주 묻는 질문
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 문의하기 */}
                    <div>
                        <h4 className="text-slate-800 font-bold mb-4">문의하기</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>
                                <a href="mailto:moson6353@naver.com" className="hover:text-blue-600 transition-colors">
                                    moson6353@naver.com
                                </a>
                            </li>
                            <li className="text-slate-400">평일 기준 1~3일 내 답변</li>
                        </ul>
                    </div>
                </div>

                {/* 하단 링크 */}
                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 MoneyAlim. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/about" className="hover:text-slate-800 transition-colors">
                            서비스 소개
                        </Link>
                        <Link href="/terms" className="hover:text-slate-800 transition-colors">
                            이용약관
                        </Link>
                        <Link href="/privacy" className="hover:text-slate-800 transition-colors">
                            개인정보처리방침
                        </Link>
                        <Link href="/contact" className="hover:text-slate-800 transition-colors">
                            문의하기
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
