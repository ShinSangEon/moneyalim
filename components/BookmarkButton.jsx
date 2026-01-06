"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookmarkButton({ subsidy, className = "", style = {} }) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        // 초기 로드 시 상태 확인
        const bookmarks = JSON.parse(localStorage.getItem("subsidy_bookmarks") || "[]");
        const exists = bookmarks.some(b => b.id === subsidy.id);
        setIsBookmarked(exists);
    }, [subsidy.id]);

    const toggleBookmark = (e) => {
        // ... (keep logic) ...
        e.preventDefault();
        e.stopPropagation();

        const bookmarks = JSON.parse(localStorage.getItem("subsidy_bookmarks") || "[]");

        if (isBookmarked) {
            const newBookmarks = bookmarks.filter(b => b.id !== subsidy.id);
            localStorage.setItem("subsidy_bookmarks", JSON.stringify(newBookmarks));
            setIsBookmarked(false);
        } else {
            const newBookmark = {
                id: subsidy.id,
                serviceId: subsidy.serviceId,
                title: subsidy.title,
                description: subsidy.description,
                category: subsidy.category,
                period: subsidy.period,
                views: subsidy.views
            };
            localStorage.setItem("subsidy_bookmarks", JSON.stringify([newBookmark, ...bookmarks]));
            setIsBookmarked(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }

        window.dispatchEvent(new Event("bookmark-updated"));
    };

    return (
        <div className={`relative ${className}`} style={style}>
            <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={toggleBookmark}
                className={`p-2 rounded-full backdrop-blur-md border transition-all ${isBookmarked
                    ? "bg-pink-500/10 border-pink-500/50 text-pink-500"
                    : "bg-slate-900/40 border-white/10 text-slate-400 hover:text-pink-400 hover:bg-slate-800"
                    }`}
            >
                <Heart
                    className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                />
            </motion.button>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap border border-white/10 shadow-xl z-50 pointer-events-none"
                    >
                        보관함에 저장됨! 💖
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
