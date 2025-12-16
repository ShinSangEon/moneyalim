"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubsidyCard from "@/components/SubsidyCard";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadBookmarks = () => {
            const saved = JSON.parse(localStorage.getItem("subsidy_bookmarks") || "[]");
            setBookmarks(saved);
            setIsLoading(false);
        };

        loadBookmarks();

        // 이벤트 리스너 추가 (다른 탭/창 동기화는 storage 이벤트, 같은 창은 커스텀 이벤트)
        window.addEventListener("bookmark-updated", loadBookmarks);
        return () => window.removeEventListener("bookmark-updated", loadBookmarks);
    }, []);

    return (
        <main className="min-h-screen bg-[#0f172a] text-white">
            <Navbar />

            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 mb-6">
                        <Heart className="w-8 h-8 text-pink-500 fill-current" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">내 보관함</h1>
                    <p className="text-slate-400 text-lg">
                        찜해둔 지원금을 모아보세요.
                    </p>
                </div>

                {isLoading ? (
                    <div className="min-h-[300px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                    </div>
                ) : bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((subsidy, index) => (
                            <SubsidyCard key={subsidy.id} subsidy={subsidy} index={index} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-slate-800/30 rounded-3xl border border-white/5"
                    >
                        <p className="text-slate-400 text-lg mb-6">아직 보관한 지원금이 없어요 😢</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors font-bold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            지원금 찾으러 가기
                        </Link>
                    </motion.div>
                )}
            </div>

            <Footer />
        </main>
    );
}
