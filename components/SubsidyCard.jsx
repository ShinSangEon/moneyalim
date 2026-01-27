"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Users, MapPin, Coins, Clock, AlertCircle, Building2 } from "lucide-react";
import { processSubsidyData, extractRegion } from "@/lib/utils";
import ScrollReveal from "@/components/ScrollReveal";

export default function SubsidyCard({ subsidy, index = 0 }) {
    // 데이터 가공
    const processed = processSubsidyData(subsidy);
    const region = extractRegion(subsidy.category);
    const isLocalGov = region !== "전국";

    return (
        <ScrollReveal
            delay={index * 0.05}
            className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >

            {/* 긴급 마감 배지 (쇼핑몰 '품절임박' 느낌) */}
            {processed.deadline.isUrgent && processed.deadline.dDay !== null && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl z-20 shadow-sm">
                    마감 D-{processed.deadline.dDay}
                </div>
            )}

            {/* 마감됨 오버레이 */}
            {processed.deadline.isExpired && (
                <div className="absolute inset-0 bg-slate-50/80 z-20 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="text-slate-400 font-bold text-lg border-2 border-slate-300 px-4 py-2 rounded-lg transform -rotate-12">
                        마감됨
                    </span>
                </div>
            )}

            <div className="p-6 flex-1 flex flex-col">
                {/* Upper Meta: Category & Region */}
                <div className="flex items-center justify-between mb-4 text-xs font-medium text-slate-500">
                    <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-md ${isLocalGov ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {region}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600">
                            {processed.processedCategory}
                        </span>
                    </div>
                </div>

                {/* Title (Product Name) */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight min-h-[3rem] group-hover:text-blue-600 transition-colors">
                    {subsidy.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 min-h-[2.5rem]">
                    {processed.processedDescription || subsidy.description}
                </p>

                {/* Price (Subsidy Amount) - Looks like Price Tag */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-end gap-1.5 mb-1">
                        <span className="text-2xl font-bold text-slate-900 leading-none">
                            {processed.processedAmount}
                        </span>
                        {/* If amount is numeric, maybe add '원' etc, but processedAmount usually has it */}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                        최대 지원 금액
                    </div>
                </div>
            </div>

            {/* Bottom Info & Action */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="truncate max-w-[120px]">{processed.processedTarget}</span>
                </div>

                <Link
                    href={`/subsidy/${subsidy.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                    보기 <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

        </ScrollReveal>
    );
}
