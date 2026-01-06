"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SubsidyCard from "@/components/SubsidyCard";
import Footer from "@/components/Footer";
import { Search, Loader2, RefreshCw, MapPin, Briefcase } from "lucide-react";
import { FILTER_CATEGORIES, FILTER_REGIONS } from "@/lib/utils";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [subsidies, setSubsidies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    // URL에서 필터 상태 가져오기
    const searchTerm = searchParams.get("search") || "";
    const selectedCategory = searchParams.get("category") || "전체";
    const selectedRegion = searchParams.get("region") || "전체";

    // API 데이터 가져오기
    useEffect(() => {
        fetchSubsidies();
    }, [searchParams]);

    const fetchSubsidies = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.set("search", searchTerm);
            if (selectedCategory !== "전체") params.set("category", selectedCategory);
            if (selectedRegion !== "전체") params.set("region", selectedRegion);

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

    // 필터 핸들러
    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "전체" || value === "") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`/search?${params.toString()}`);
    };

    const handleSearch = (e) => {
        // 검색어는 디바운싱 처리하면 좋지만 일단 바로 적용 (또는 별도 검색 버튼으로 처리)
        // 여기서는 입력값만 업데이트하고 엔터나 버튼 클릭 시 URL 업데이트하도록 수정 필요
        // 하지만 기존 UI가 입력 시 바로 검색이 아니라 버튼 클릭 시 검색이었음.
        // 여기서는 입력 상태를 로컬로 관리하고 검색 버튼 클릭 시 URL 업데이트하는 게 나을 수 있음.
        // 하지만 편의상 입력값 변경 시 바로 URL 업데이트는 UX가 안좋으므로(타이핑마다 리로드),
        // 로컬 state로 관리하고 검색 버튼 클릭 시 updateFilter 호출하도록 변경.
    };

    // 검색어 로컬 상태 관리 (타이핑 중)
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // URL 변경 시 로컬 검색어 동기화
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    const onSearchSubmit = () => {
        updateFilter("search", localSearchTerm);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearchSubmit();
        }
    };

    const resetFilters = () => {
        setLocalSearchTerm("");
        router.push("/search");
    };

    const hasActiveFilters = searchTerm || selectedCategory !== "전체" || selectedRegion !== "전체";

    return (
        <main className="min-h-screen bg-[#0f172a] pb-20">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">맞춤 지원금 찾기</h1>
                    <p className="text-gray-400">나에게 필요한 지원금을 검색해보세요.</p>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 mb-8 space-y-6">
                    {/* 검색창 */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="검색어를 입력하세요 (예: 월세, 청년, 저소득, 서울시 강남구)"
                                value={localSearchTerm}
                                onChange={(e) => setLocalSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <button
                            onClick={onSearchSubmit}
                            disabled={loading}
                            className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white px-5 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            검색
                        </button>
                    </div>

                    {/* 지역 필터 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-slate-300">지역별</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {FILTER_REGIONS.map((region) => (
                                <button
                                    key={region.value}
                                    onClick={() => updateFilter("region", region.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedRegion === region.value
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                                        : "bg-slate-700/60 text-gray-400 hover:bg-slate-600 hover:text-white"
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
                            <Briefcase className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-slate-300">분야별</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {FILTER_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => updateFilter("category", cat.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.value
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                        : "bg-slate-700/60 text-gray-400 hover:bg-slate-600 hover:text-white"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 출생연도 필터 (나이) */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-slate-300">출생연도 (나이 맞춤)</span>
                        </div>
                        <div className="relative max-w-xs">
                            <select
                                value={searchParams.get("age") || ""}
                                onChange={(e) => updateFilter("age", e.target.value)}
                                className="w-full appearance-none bg-slate-700/60 text-white border border-white/5 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                            >
                                <option value="">전체 (출생연도 선택)</option>
                                {Array.from({ length: 86 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}년생 ({new Date().getFullYear() - year + 1}세)
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-400">지원금 정보를 불러오는 중...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-20">
                        <div className="bg-red-500/10 text-red-400 px-6 py-4 rounded-xl inline-block mb-4">
                            {error}
                        </div>
                        <br />
                        <button
                            onClick={fetchSubsidies}
                            className="text-blue-400 hover:text-blue-300 font-medium mt-4"
                        >
                            다시 시도하기
                        </button>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && (
                    <>
                        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-gray-400 break-keep">
                                    총 <span className="text-white font-bold">{totalCount}</span>건의 지원금이 검색되었습니다.
                                </p>
                                {(selectedRegion !== "전체" || selectedCategory !== "전체") && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRegion !== "전체" && (
                                            <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20 break-keep">
                                                {selectedRegion}
                                            </span>
                                        )}
                                        {selectedCategory !== "전체" && (
                                            <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20 break-keep">
                                                {selectedCategory}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-slate-500 hover:text-slate-300 px-3 py-1 rounded-lg bg-slate-800/50"
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
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-gray-400 text-lg mb-2">검색 결과가 없습니다.</p>
                                <p className="text-gray-500 text-sm mb-4">다른 조건으로 검색해보세요.</p>
                                <button
                                    onClick={resetFilters}
                                    className="text-blue-400 hover:text-blue-300 font-medium"
                                >
                                    필터 초기화하기
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
