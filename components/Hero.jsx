"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function Hero({ totalCount }) {
    const router = useRouter();

    return (
        <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content (Text) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 text-center lg:text-left z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs sm:text-sm font-semibold">
                            <TrendingUp className="w-4 h-4" />
                            <span>실시간 정부지원금 <CountUp end={totalCount || 0} separator="," duration={2} />개 대기 중</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.2] mb-6">
                            놓치고 있던 <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                                숨은 지원금
                            </span>을 <br />
                            쇼핑하듯 찾아보세요.
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            나도 받을 수 있을까? 고민하지 마세요.<br className="hidden sm:block" />
                            간단한 키워드 검색으로 나에게 딱 맞는 혜택을 찾아드립니다.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => router.push('/search')}
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                지원금 조회하기
                            </button>
                            <button
                                onClick={() => router.push('/search?sort=popular')}
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                인기 지원금 보기
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Content (Image) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 relative w-full h-[300px] sm:h-[400px] lg:h-[500px]"
                    >
                        {/* Blob Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/50 to-teal-100/50 rounded-full blur-3xl -z-10 animate-pulse-slow" />

                        <Image
                            src="/hero-lifestyle.png"
                            alt="Financial Growth Lifestyle"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
