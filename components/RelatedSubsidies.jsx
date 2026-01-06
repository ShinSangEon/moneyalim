"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { mapCategory, extractDeadline } from "@/lib/utils";

export default function RelatedSubsidies({ subsidies }) {
    if (!subsidies || subsidies.length === 0) return null;

    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    이런 지원금도 놓치지 마세요
                </h2>
                <Link
                    href="/search"
                    className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                    더보기 <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subsidies.map((subsidy) => {
                    const deadline = extractDeadline(subsidy.period);

                    return (
                        <Link
                            key={subsidy.id}
                            href={`/subsidy/${subsidy.serviceId}`}
                            className="group block bg-slate-800/30 hover:bg-slate-800/60 border border-white/5 hover:border-blue-500/30 rounded-xl p-5 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Hover highlight effect */}
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                                        {mapCategory(subsidy.category)}
                                    </span>
                                    {deadline.dDay !== null && deadline.dDay >= 0 && (
                                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-md">
                                            D-{deadline.dDay}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-300 transition-colors">
                                    {subsidy.title}
                                </h3>

                                <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                                    {subsidy.description || "상세 내용을 확인해주세요."}
                                </p>

                                <div className="flex items-center text-xs text-slate-500">
                                    <span>{subsidy.hostOrg || "정부"}</span>
                                    <span className="mx-2">•</span>
                                    <span>{subsidy.region || "전국"}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
