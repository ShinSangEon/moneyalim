"use client";

import { useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function KakaoShareButton({ title, description, imageUrl }) {
    useEffect(() => {
        // Kakao SDK 초기화
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_KEY;

        // 키가 없거나 더미 값일 경우 초기화하지 않음
        if (typeof window !== "undefined" && window.Kakao && kakaoKey && kakaoKey !== 'undefined') {
            if (!window.Kakao.isInitialized()) {
                try {
                    window.Kakao.init(kakaoKey);
                } catch (error) {
                    console.error("Kakao SDK init failed:", error);
                }
            }
        }
    }, []);

    const handleShare = () => {
        if (typeof window !== "undefined") {
            if (!window.Kakao) {
                alert("카카오 SDK가 로드되지 않았습니다. 새로고침 후 다시 시도해주세요.");
                return;
            }

            if (!window.Kakao.isInitialized()) {
                console.log("Kakao Key:", process.env.NEXT_PUBLIC_KAKAO_KEY); // 디버깅용
                alert(`카카오 초기화 실패. 키 설정을 확인해주세요. (현재 키: ${process.env.NEXT_PUBLIC_KAKAO_KEY ? "설정됨" : "미설정"})`);

                // 재시도
                const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_KEY;
                if (kakaoKey) window.Kakao.init(kakaoKey);
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
