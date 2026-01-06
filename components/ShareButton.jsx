"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ title, description }) {
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: title,
                    text: description,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("링크가 클립보드에 복사되었습니다!");
            }
        } catch (error) {
            console.error("공유 실패:", error);
        }
    };

    return (
        <button 
            onClick={handleShare}
            className="sm:w-auto px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-white/10 flex items-center justify-center gap-2"
        >
            <Share2 className="w-5 h-5" />
            공유하기
        </button>
    );
}

