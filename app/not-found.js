import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0f172a] font-pretendard flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4">
                <div className="text-center max-w-lg mx-auto py-20">
                    {/* Animated 404 Text/Icon */}
                    <div className="relative mb-8">
                        <h1 className="text-9xl font-black text-slate-800 select-none">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl pt-2">🤔</span>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        페이지를 찾을 수 없습니다
                    </h2>

                    <p className="text-slate-400 mb-8 leading-relaxed">
                        요청하신 페이지가 사라졌거나 잘못된 주소입니다.<br />
                        입력하신 주소를 다시 한 번 확인해주세요.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-900/20"
                        >
                            홈으로 가기
                        </Link>
                        <Link
                            href="/search"
                            className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all border border-white/5"
                        >
                            지원금 검색하기
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
