"use client";

import AdSense from "@/components/AdSense";

export default function FloatingAds() {
    return (
        <div className="hidden min-[1650px]:block pointer-events-none">
            {/* Left Wing Ad */}
            <div className="fixed top-1/2 left-[calc(50%-820px)] -translate-y-1/2 w-[160px] h-[600px] pointer-events-auto z-40">
                <div className="w-full h-full bg-slate-800/30 rounded-lg overflow-hidden border border-white/5 backdrop-blur-sm flex items-center justify-center">
                    <AdSense
                        slot="MAIN_LEFT_WING"
                        style={{ display: 'inline-block', width: '160px', height: '600px' }}
                        format="" // 고정 크기 사용 시 format 비움
                    />
                    {/* Placeholder for dev */}
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 opacity-0 hover:opacity-100 transition-opacity">
                        광고 (좌)
                    </div>
                </div>
            </div>

            {/* Right Wing Ad */}
            <div className="fixed top-1/2 right-[calc(50%-820px)] -translate-y-1/2 w-[160px] h-[600px] pointer-events-auto z-40">
                <div className="w-full h-full bg-slate-800/30 rounded-lg overflow-hidden border border-white/5 backdrop-blur-sm flex items-center justify-center">
                    <AdSense
                        slot="MAIN_RIGHT_WING"
                        style={{ display: 'inline-block', width: '160px', height: '600px' }}
                        format=""
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 opacity-0 hover:opacity-100 transition-opacity">
                        광고 (우)
                    </div>
                </div>
            </div>
        </div>
    );
}
