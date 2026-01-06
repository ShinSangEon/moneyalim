"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Flame } from "lucide-react";

export default function PopularSearches() {
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                // 상위 10개 키워드 가져오기 (API 라우트 필요 혹은 server action)
                // 지금은 GET /api/subsidies?mode=trends 같은게 없으므로
                // 임시로 클라이언트에서 호출할 별도 엔드포인트나 방식을 만들어야 함.
                // 또는 /api/subsidies/trends 라우트를 새로 파는게 깔끔함.
                const res = await fetch('/api/subsidies/trends');
                if (res.ok) {
                    const data = await res.json();
                    setTerms(data);
                }
            } catch (err) {
                console.error("Failed to load trends", err);
            }
        };

        fetchTrends();
    }, []);

    if (terms.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-900/40 backdrop-blur-md p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 px-2">
                    <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                    <span className="text-sm font-bold text-white whitespace-nowrap">실시간 급상승</span>
                </div>

                {/* 가로 스크롤 영역 (모바일) / 랩 (데스크탑) */}
                <div className="flex-1 overflow-x-auto w-full no-scrollbar flex items-center gap-2">
                    {terms.map((item, index) => (
                        <Link
                            key={item.term}
                            href={`/search?search=${encodeURIComponent(item.term)}`}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${index < 3
                                    ? "bg-slate-800 text-white border border-blue-500/30 hover:bg-blue-600 hover:border-blue-500"
                                    : "bg-slate-800/50 text-slate-300 border border-white/5 hover:bg-slate-700"
                                }`}
                        >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${index === 0 ? "bg-yellow-500 text-black" :
                                    index === 1 ? "bg-gray-300 text-black" :
                                        index === 2 ? "bg-amber-600 text-white" :
                                            "bg-slate-700 text-slate-400"
                                }`}>
                                {index + 1}
                            </span>
                            {item.term}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
