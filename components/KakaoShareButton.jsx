"use client";

import { useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function KakaoShareButton({ title, description, imageUrl }) {
    useEffect(() => {
        // Kakao SDK 초기화
        if (typeof window !== "undefined" && window.Kakao) {
            if (!window.Kakao.isInitialized()) {
                // TODO: 실제 운영 시에는 본인의 JavaScript 키를 발급받아 교체해야 합니다.
                // developers.kakao.com 에서 키 발급 -> [플랫폼] -> [Web] 사이트 도메인 등록 필요
                window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
            }
        }
    }, []);

    const handleShare = () => {
        if (typeof window !== "undefined" && window.Kakao) {
            if (!window.Kakao.isInitialized()) {
                alert("카카오 키 설정이 필요합니다. (개발자 설정)");
                return;
            }

            window.Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: title,
                    description: description,
                    imageUrl: imageUrl || 'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.jpg', // 기본 이미지
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    {
                        title: '자세히 보기',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            });
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex-1 min-w-[120px] bg-[#FEE500] hover:bg-[#FDD835] text-[#3c1e1e] py-3 rounded-xl font-medium transition-colors border border-white/10 flex items-center justify-center gap-2"
        >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="font-bold">카카오톡</span>
        </button>
    );
}
