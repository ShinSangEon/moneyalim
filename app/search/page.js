"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SubsidyCard from "@/components/SubsidyCard";
import Footer from "@/components/Footer";
import { Search, Loader2, RefreshCw, MapPin, Briefcase, Users, Filter, Heart } from "lucide-react";
import { FILTER_CATEGORIES, FILTER_REGIONS } from "@/lib/utils";

// 지원 대상 필터 상수 정의
const FILTER_STATUSES = [
    { value: "전체", label: "전체" },
    { value: "청년", label: "🎓 청년" },
    { value: "학생", label: "🎒 학생" },
    { value: "구직자", label: "🔍 구직자" },
    { value: "근로자", label: "💼 직장인" },
    { value: "소상공인", label: "🏪 소상공인" },
    { value: "임신출산", label: "🤰 임신/육아" },
    { value: "저소득층", label: "💰 저소득층" },
    { value: "장애인", label: "🤝 장애인" },
    { value: "보훈대상", label: "🇰🇷 보훈대상" },
    { value: "다문화", label: "🌏 다문화" },
];

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [subsidies, setSubsidies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    // URL에서 필터 상태 가져오기
    export default function SearchPage() {
        const searchParams = useSearchParams();
        const router = useRouter();

        const [subsidies, setSubsidies] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [totalCount, setTotalCount] = useState(0);

        // URL에서 필터 상태 가져오기 (초기값)
        const initialSearchTerm = searchParams.get("search") || "";
        const initialCategory = searchParams.get("category") || "전체";
        const initialRegion = searchParams.get("region") || "전체";
        const initialStatus = searchParams.get("status") || "전체";

        // 로컬 상태 관리 (즉시 반영 x)
        const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm);
        const [localCategory, setLocalCategory] = useState(initialCategory);
        const [localRegion, setLocalRegion] = useState(initialRegion);
        const [localStatus, setLocalStatus] = useState(initialStatus);
        const [localAge, setLocalAge] = useState(searchParams.get("age") || "");

        // URL 변경 시 로컬 상태 동기화 (뒤로가기 등 대응)
        useEffect(() => {
            setLocalSearchTerm(searchParams.get("search") || "");
            setLocalCategory(searchParams.get("category") || "전체");
            setLocalRegion(searchParams.get("region") || "전체");
            setLocalStatus(searchParams.get("status") || "전체");
            setLocalAge(searchParams.get("age") || "");

            fetchSubsidies();
        }, [searchParams]);

        const fetchSubsidies = async () => {
            setLoading(true);
            setError(null);
            try {
                // API 호출은 URL 파라미터 기준 (로컬 상태 아님)
                const params = new URLSearchParams(searchParams.toString());
                // 이미 URLSearchParams에 값이 있지만, 명시적으로 확인

                const response = await fetch(`/api/subsidies?${params.toString()}`);
                const data = await response.json();

                if (data.success) {
                    setSubsidies(data.data || []);
                    setTotalCount(data.totalCount || 0);
                } else {
                    setError(data.error || "데이터를 불러오지 못했습니다.");
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError("서버에 연결할 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };

        // 필터 적용 (검색 버튼 클릭 시)
        const handleApplyFilters = () => {
            const params = new URLSearchParams();
            if (localSearchTerm) params.set("search", localSearchTerm);
            if (localCategory !== "전체") params.set("category", localCategory);
            if (localRegion !== "전체") params.set("region", localRegion);
            if (localStatus !== "전체") params.set("status", localStatus);
            if (localAge) params.set("age", localAge);

            router.push(`/search?${params.toString()}`);
        };

        // 로컬 필터 변경 핸들러
        const toggleLocalFilter = (type, value) => {
            if (type === "region") setLocalRegion(prev => prev === value ? "전체" : value);
            if (type === "category") setLocalCategory(prev => prev === value ? "전체" : value);
            if (type === "status") setLocalStatus(prev => prev === value ? "전체" : value);
            if (type === "age") setLocalAge(value);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleApplyFilters();
            }
        };

        const resetFilters = () => {
            setLocalSearchTerm("");
            setLocalCategory("전체");
            setLocalRegion("전체");
            setLocalStatus("전체");
            setLocalAge("");
            router.push("/search");
        };

        const hasActiveFilters = localSearchTerm || localCategory !== "전체" || localRegion !== "전체" || localStatus !== "전체" || localAge;

        return (
            <main className="min-h-screen bg-slate-50 pb-20">
                <Navbar />

                <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">맞춤 지원금 찾기</h1>
                        <p className="text-slate-500">나에게 필요한 지원금을 검색해보세요.</p>
                    </div>

                    {/* Search & Filter Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-8">
                        {/* 검색창 */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="검색어를 입력하세요 (예: 월세, 청년, 저소득, 서울시 강남구)"
                                    value={localSearchTerm}
                                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                            <button
                                onClick={handleApplyFilters}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                검색하기
                            </button>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* 필터 영역 */}
                        <div className="space-y-6">
                            {/* 지역 필터 */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">지역별</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {FILTER_REGIONS.map((region) => (
                                        <button
                                            key={region.value}
                                            onClick={() => toggleLocalFilter("region", region.value)}
                                            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border ${localRegion === region.value
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                                }`}
                                        >
                                            {region.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 분야 필터 */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">분야별</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {FILTER_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => toggleLocalFilter("category", cat.value)}
                                            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border ${localCategory === cat.value
                                                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-500/20"
                                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 지원 대상 (Status) 필터 */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
                                        <Heart className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">지원 대상</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {FILTER_STATUSES.map((status) => (
                                        <button
                                            key={status.value}
                                            onClick={() => toggleLocalFilter("status", status.value)}
                                            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border ${localStatus === status.value
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-500/20"
                                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                                }`}
                                        >
                                            {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 출생연도 필터 */}
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                                <div className="w-full sm:max-w-xs">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">출생연도 (나이 맞춤)</span>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={localAge}
                                            onChange={(e) => toggleLocalFilter("age", e.target.value)}
                                            className="w-full appearance-none bg-white text-slate-700 border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors cursor-pointer font-medium"
                                        >
                                            <option value="">전체 (출생연도 선택)</option>
                                            {Array.from({ length: 86 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                                <option key={year} value={year}>
                                                    {year}년생 ({new Date().getFullYear() - year + 1}세)
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                            <Filter className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* 하단 적용 버튼 (Floating on Mobile usually, but here inline) */}
                                <button
                                    onClick={handleApplyFilters}
                                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    선택한 필터 적용하기
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-medium">나에게 딱 맞는 지원금을 찾고 있어요...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-20">
                            <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl inline-block mb-4 border border-red-100 font-medium">
                                {error}
                            </div>
                            <br />
                            <button
                                onClick={fetchSubsidies}
                                className="text-blue-600 hover:text-blue-500 font-bold mt-4 underline"
                            >
                                다시 시도하기
                            </button>
                        </div>
                    )}

                    {/* Results */}
                    {!loading && !error && (
                        <>
                            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-slate-500">
                                        총 <span className="text-slate-900 font-bold text-lg">{totalCount}</span>건의 지원금이 검색되었습니다.
                                    </p>
                                    {(selectedRegion !== "전체" || selectedCategory !== "전체") && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRegion !== "전체" && (
                                                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-100">
                                                    {selectedRegion}
                                                </span>
                                            )}
                                            {selectedCategory !== "전체" && (
                                                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                                                    {selectedCategory}
                                                </span>
                                            )}
                                            {selectedStatus !== "전체" && (
                                                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-100">
                                                    {selectedStatus}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {hasActiveFilters && (
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 font-medium transition-colors shadow-sm"
                                    >
                                        필터 초기화
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subsidies.map((subsidy, index) => (
                                    <SubsidyCard key={subsidy.id} subsidy={subsidy} index={index} />
                                ))}
                            </div>

                            {subsidies.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="bg-white rounded-3xl p-10 max-w-lg mx-auto border border-slate-100 shadow-sm">
                                        <div className="text-6xl mb-6">🤔</div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                                            조건에 맞는 지원금이 없어요
                                        </h3>
                                        <p className="text-slate-500 mb-8 leading-relaxed">
                                            검색 조건을 조금 더 넓혀보시거나<br />
                                            필터를 초기화하여 다시 찾아보세요.
                                        </p>
                                        <button
                                            onClick={resetFilters}
                                            className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200"
                                        >
                                            모든 지원금 보기
                                        </button>

                                        {/* 추천 콘텐츠 */}
                                        <div className="border-t border-slate-100 pt-8 mt-8">
                                            <p className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                                                추천 카테고리
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {[
                                                    { label: "청년", category: "생활안정" },
                                                    // Note: Actual categories might differ, ensuring safe fallbacks or correct mapping is good, 
                                                    // but using generic ones for 'Recommended' is fine.
                                                    { label: "소상공인", category: "소상공인" },
                                                    { label: "육아", category: "보육/교육" },
                                                ].map((item, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => updateFilter("search", item.label)}
                                                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-sm font-medium rounded-lg transition-colors border border-slate-200"
                                                    >
                                                        #{item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <Footer />
            </main>
        );
    }
