"use client";

import AdSense from "@/components/AdSense";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function MobileStickyAd() {
    // [승인 전 비활성화]
    return null;

    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom duration-500">
            {/* 닫기 버튼 영역 */}
            <div className="flex justify-end px-2 pb-1 bg-gradient-to-t from-slate-900 via-slate-900/0 to-transparent">
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 bg-black/50 backdrop-blur-sm rounded-full text-white/70 hover:text-white"
                >
                    <X size={16} />
                </button>
            </div>

            {/* 광고 영역 */}
            <div className="bg-white flex justify-center items-center shadow-[0_-5px_20px_rgba(0,0,0,0.3)] min-h-[60px]">
                <AdSense
                    slot="MAIN_MOBILE_FOOTER" // 실제 슬롯 ID는 교체 필요
                    style={{ display: 'inline-block', width: '100%', maxWidth: '320px', height: '50px' }}
                    format="horizontal"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400 opacity-0 group-hover:opacity-100">
                    모바일 하단 광고 영역
                </div>
            </div>
        </div>
    );
}
