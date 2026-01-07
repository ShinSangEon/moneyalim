"use client";

import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SmartFilter from "@/components/SmartFilter";
import PopularSearches from "@/components/PopularSearches";
import Link from "next/link";

import { useRef, useEffect } from "react";
import { useInView, animate } from "framer-motion";

function Counter({ value }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10px" });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration: 2,
                ease: "easeOut",
                onUpdate: (latest) => {
                    if (ref.current) {
                        ref.current.textContent = Intl.NumberFormat("en-US").format(latest.toFixed(0));
                    }
                }
            });
            return () => controls.stop();
        }
    }, [isInView, value]);

    return <span ref={ref} />;
}

export default function Hero({ totalCount }) {
    const router = useRouter();

    return (
        <div className="relative pt-24 pb-16 sm:pt-40 sm:pb-32 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[80px] sm:blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                        x: [0, -30, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[80px] sm:blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-0 left-1/3 w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[60px] sm:blur-[100px]"
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-6 sm:mb-8"
                >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                        현재 시행 중인 지원금 <Counter value={totalCount || 0} />개
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 sm:mb-8 leading-tight"
                >
                    <span className="block text-white mb-2">본인에게 딱 맞는</span>
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 animate-gradient-x">
                        지원금을 찾아가세요
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
                >
                    지역별·대상별로 흩어져 있는 <br className="block sm:hidden" />
                    <span className="text-slate-200 font-semibold">정부 지원금 정보</span>를 <br className="hidden sm:block" />
                    한 곳에서 <span className="text-blue-400 font-bold">쉽고 빠르게</span> 찾아보세요.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-10 sm:mb-12"
                >
                    <SmartFilter />
                </motion.div>

                {/* 실시간 인기 검색어 */}
                <PopularSearches />
            </div>
        </div>
    );
}
