"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Users, MapPin, Coins, Clock, AlertCircle, Building2 } from "lucide-react";
import { processSubsidyData, extractRegion } from "@/lib/utils";
import BookmarkButton from "@/components/BookmarkButton";
import ScrollReveal from "@/components/ScrollReveal";

export default function SubsidyCard({ subsidy, index = 0 }) {
    // 데이터 가공
    const processed = processSubsidyData(subsidy);
    const region = extractRegion(subsidy.category);
    const isLocalGov = region !== "전국";

    return (
        <ScrollReveal
            delay={index * 0.05} // Stagger effect
            className="group relative bg-slate-800/50 rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 block"
        >

            {/* 긴급 마감 배지 */}
            {processed.deadline.isUrgent && processed.deadline.dDay !== null && (
                <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-br-xl z-20 flex items-center gap-1 shadow-lg">
                    <AlertCircle className="w-3 h-3" />
                    마감임박 D-{processed.deadline.dDay}
                </div>
            )}

            {/* 마감됨 오버레이 */}
            {processed.deadline.isExpired && (
                <div className="absolute inset-0 bg-slate-900/80 z-20 flex items-center justify-center">
                    <span className="text-slate-400 font-bold text-lg">마감된 지원금</span>
                </div>
            )}

            {/* Header */}
            <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                            {processed.processedCategory}
                        </span>
                        {/* 지역 표시 */}
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${isLocalGov
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            : 'bg-slate-700/60 text-slate-400 border border-white/5'
                            }`}>
                            <MapPin className="w-3 h-3" />
                            {region}
                        </span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors min-h-[3.5rem]">
                    {subsidy.title}
                </h3>

                {/* 담당 기관 (지자체인 경우 구체적으로 표시) */}
                {isLocalGov && (
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {subsidy.category}
                    </p>
                )}

                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
                    {processed.processedDescription || subsidy.description?.substring(0, 80)}
                </p>
            </div>

            {/* Info Section */}
            <div className="px-5 py-3 mt-auto space-y-2.5 border-t border-white/5 bg-slate-800/30">
                {/* 지원금액 */}
                <div className="flex items-center gap-2.5 text-sm">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10">
                        <Coins className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-slate-200 font-medium truncate">
                        {processed.processedAmount}
                    </span>
                </div>

                {/* 지원대상 */}
                <div className="flex items-center gap-2.5 text-sm">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10">
                        <Users className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-slate-300 truncate">
                        {processed.processedTarget}
                    </span>
                </div>

                {/* 신청기한 */}
                <div className="flex items-center gap-2.5 text-sm">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${processed.deadline.isUrgent ? 'bg-red-500/15' : 'bg-slate-700/50'
                        }`}>
                        {processed.deadline.isUrgent ? (
                            <Clock className="w-4 h-4 text-red-400" />
                        ) : (
                            <Calendar className="w-4 h-4 text-slate-400" />
                        )}
                    </div>
                    <span className={`truncate ${processed.deadline.isUrgent ? 'text-red-400 font-medium' : 'text-slate-400'
                        }`}>
                        {processed.deadline.dDay !== null && processed.deadline.dDay >= 0
                            ? `D-${processed.deadline.dDay} (${processed.deadline.display})`
                            : processed.deadline.display
                        }
                    </span>
                </div>
            </div>

            {/* CTA Button */}
            <div className="p-4 pt-3">
                <Link
                    href={`/subsidy/${subsidy.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-900/20 group-hover:shadow-blue-500/30"
                >
                    자세히 보기
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </ScrollReveal>
    );
}
