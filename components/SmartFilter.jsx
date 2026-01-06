"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Check } from "lucide-react";
import { FILTER_REGIONS, FILTER_CATEGORIES } from "@/lib/utils";

export default function SmartFilter({ onSearch }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // 5가지 필터 상태
    const [birthYear, setBirthYear] = useState("");
    const [gender, setGender] = useState("");
    const [region, setRegion] = useState("전국");
    const [category, setCategory] = useState("전체");
    const [status, setStatus] = useState("전체");

    // 출생연도 옵션 (1940 ~ 2025)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 90 }, (_, i) => currentYear - i);

    // 상황/특성 옵션
    const statusOptions = [
        { value: "전체", label: "해당 없음" },
        { value: "학생", label: "🎓 학생 (초/중/고/대)" },
        { value: "구직자", label: "🔍 구직자/취준생" },
        { value: "근로자", label: "💼 직장인/근로자" },
        { value: "소상공인", label: "🏪 소상공인/자영업" },
        { value: "농어민", label: "🌾 농업/어업인" },
        { value: "저소득층", label: "💰 기초생활/차상위" },
        { value: "임신출산", label: "👶 임신/출산/육아" },
        { value: "장애인", label: "♿ 장애인" },
        { value: "보훈대상", label: "🇰🇷 국가보훈대상자" },
        { value: "다문화", label: "🌏 다문화가정" },
    ];

    const handleSearch = () => {
        setIsLoading(true);
        const params = new URLSearchParams();

        if (birthYear) params.set("age", birthYear); // 출생연도로 보냄 (API에서 나이 계산)
        if (gender && gender !== "무관") params.set("gender", gender);
        if (region && region !== "전체") params.set("region", region);
        if (category && category !== "전체") params.set("category", category);
        if (status && status !== "전체") params.set("status", status);

        router.push(`/search?${params.toString()}`);
        setIsLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                {/* 1. 출생연도 (나이) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">태어난 연도</label>
                    <div className="relative">
                        <select
                            value={birthYear}
                            onChange={(e) => setBirthYear(e.target.value)}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            <option value="" className="bg-slate-800 text-slate-400">선택해주세요</option>
                            {years.map((year) => (
                                <option key={year} value={year} className="bg-slate-800">
                                    {year}년생 ({currentYear - year + 1}세)
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 2. 성별 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">성별</label>
                    <div className="flex gap-2">
                        {["남자", "여자"].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGender(gender === g ? "" : g)}
                                className={`flex-1 py-3.5 rounded-xl border transition-all font-medium ${gender === g
                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                                    }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. 거주지 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">거주 지역</label>
                    <div className="relative">
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            {FILTER_REGIONS.map((r) => (
                                <option key={r.value} value={r.value} className="bg-slate-800">
                                    {r.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 4. 관심 분야 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">관심 분야</label>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            {FILTER_CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value} className="bg-slate-800">
                                    {c.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 5. 개인 상황 (직업 등) */}
                <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">개인 상황 / 특성</label>
                    <div className="relative">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            {statusOptions.map((s) => (
                                <option key={s.value} value={s.value} className="bg-slate-800">
                                    {s.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

            </div>

            <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
                {isLoading ? (
                    <span className="animate-pulse">검색 중...</span>
                ) : (
                    <>
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        나를 위한 지원금 조회하기
                    </>
                )}
            </button>
        </div>
    );
}
