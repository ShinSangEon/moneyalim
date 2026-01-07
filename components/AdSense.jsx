"use client";

import { useEffect, useRef } from "react";

export default function AdSense({
    pid = process.env.NEXT_PUBLIC_ADSENSE_ID, // .env에서 가져옴
    slot = "XXXXXXXXXX", // 나중에 사용자 코드로 변경
    style = { display: "block" },
    format = "auto",
    responsive = "true",
    layoutKey = "" // In-feed 광고용
}) {
    // [승인 전 비활성화] 콘텐츠 중심 심사를 위해 광고 컴포넌트 렌더링 중단
    return null;

    const isDev = process.env.NODE_ENV === "development";
    const adRef = useRef(null);

    useEffect(() => {
        if (isDev) return; // 개발 모드에서는 광고 스크립트 실행 안 함 (플레이스홀더 표시)

        try {
            if (typeof window !== "undefined") {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            // 이미 광고가 로드된 경우 발생하는 에러 무시
            if (process.env.NODE_ENV !== 'development' && !err.message?.includes('already have ads')) {
                console.error("AdSense Error:", err);
            }
        }
    }, [isDev]);

    if (isDev) {
        return (
            <div className="w-full bg-yellow-400/10 border-2 border-dashed border-yellow-400/50 rounded-xl p-4 flex flex-col items-center justify-center min-h-[100px] text-yellow-200 text-sm gap-2 my-8">
                <span className="font-bold">광고 영역 (개발 모드)</span>
                <span className="text-xs opacity-70">실제 배포 시 구글 광고가 표시됩니다</span>
                <span className="text-xs bg-black/30 px-2 py-1 rounded">Slot ID: {slot}</span>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden my-8 flex justify-center bg-slate-800/20 rounded-xl">
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client={pid}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
                data-ad-layout-key={layoutKey || undefined}
            />
        </div>
    );
}
