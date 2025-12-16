"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, MapPin, X } from "lucide-react";
import { FILTER_CATEGORIES, FILTER_REGIONS } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchFilter() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("전체");
    const [isPsModalOpen, setIsModalOpen] = useState(false);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        if (category !== "전체") {
            router.push(`/search?category=${encodeURIComponent(category)}`);
        }
        setIsModalOpen(false);
    };

    const handleRegionClick = (regionValue) => {
        router.push(`/search?region=${encodeURIComponent(regionValue)}`);
        setIsModalOpen(false);
    };

    // 인기 지역 (상위 5개)
    const popularRegions = FILTER_REGIONS.slice(0, 7);

    return (
        <>
            <div className="w-full bg-slate-900/50 border-y border-white/5 backdrop-blur-sm sticky top-16 z-40 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

                    {/* [Desktop] Full View */}
                    <div className="hidden md:flex flex-col gap-4">
                        {/* 분야별 */}
                        <div className="flex flex-wrap gap-2 pb-2">
                            {FILTER_CATEGORIES.slice(0, 8).map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => handleCategoryClick(cat.value)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.value
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        {/* 지역 바로가기 */}
                        <div className="flex flex-wrap items-center gap-2 pb-2">
                            <span className="flex items-center gap-1 text-sm text-slate-500 whitespace-nowrap">
                                <MapPin className="w-4 h-4" />
                                지역:
                            </span>
                            {popularRegions.map((region) => (
                                <button
                                    key={region.value}
                                    onClick={() => handleRegionClick(region.value)}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-400 hover:bg-emerald-600/20 hover:text-emerald-400 border border-white/5 transition-all"
                                >
                                    {region.label}
                                </button>
                            ))}
                            <button
                                onClick={() => router.push('/search')}
                                className="whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all"
                            >
                                전체 검색 →
                            </button>
                        </div>
                    </div>

                    {/* [Mobile] Compact Button */}
                    <div className="md:hidden flex justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/30 active:scale-95 transition-all"
                        >
                            <Filter className="w-4 h-4" />
                            빠른 맞춤 필터 설정
                        </button>
                    </div>

                </div>
            </div>

            {/* [Mobile] Modal Overlay */}
            <AnimatePresence>
                {isPsModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-blue-400" />
                                    맞춤 지원금 필터
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 overflow-y-auto space-y-6">
                                {/* Categories */}
                                <div>
                                    <div className="text-sm font-medium text-slate-400 mb-3">관심 분야</div>
                                    <div className="flex flex-wrap gap-2">
                                        {FILTER_CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.value}
                                                onClick={() => handleCategoryClick(cat.value)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.value
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Regions */}
                                <div>
                                    <div className="text-sm font-medium text-slate-400 mb-3">거주 지역</div>
                                    <div className="flex flex-wrap gap-2">
                                        {FILTER_REGIONS.map((region) => (
                                            <button
                                                key={region.value}
                                                onClick={() => handleRegionClick(region.value)}
                                                className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-400 transition-all border border-white/5"
                                            >
                                                {region.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
