export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                                SubsidyFinder
                            </span>
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            2026년 최신 정부지원금 데이터를 기반으로 개인 맞춤형 복지 혜택을 찾아드립니다.
                            놓치고 있는 숨은 지원금을 지금 바로 확인하세요.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">서비스</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">지원금 찾기</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">자주 묻는 질문</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">공지사항</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">문의하기</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>contact@subsidyfinder.com</li>
                            <li>02-1234-5678</li>
                            <li>평일 09:00 - 18:00</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 SubsidyFinder. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="/terms" className="hover:text-white transition-colors">이용약관</a>
                        <a href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

