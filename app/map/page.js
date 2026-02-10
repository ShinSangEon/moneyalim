import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KoreaMap from "@/components/KoreaMap";
import AdSense from "@/components/AdSense";
import { MapPin } from "lucide-react";

export const metadata = {
    title: "우리 동네 지원금 지도 | MoneyAlim",
    description: "내가 사는 지역의 지원금만 쏙쏙! 서울, 경기, 부산 등 시도별 맞춤 지원금을 지도에서 클릭 한 번으로 찾아보세요.",
    openGraph: {
        title: "우리 동네 지원금 지도 | MoneyAlim",
        description: "지역별 맞춤 정부지원금을 지도에서 한눈에 찾아보세요.",
        url: "https://moneyalim.com/map",
        type: "website",
    },
};

export default function MapPage() {
    return (
        <main className="min-h-screen bg-[#0f172a] text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center lg:items-start">

                {/* 텍스트 & 설명 */}
                <div className="flex-1 text-center lg:text-left pt-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                        <MapPin className="w-3 h-3" />
                        REGION MAP
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
                        <span className="block text-slate-400 text-2xl sm:text-3xl mb-2 font-medium">우리 동네 혜택</span>
                        지도로 한눈에 찾기
                    </h1>
                    <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                        내가 사는 지역을 클릭해보세요. <br />
                        해당 지자체 주민만 받을 수 있는 <strong>숨은 혜택</strong>을 보여드립니다.
                    </p>

                    <AdSense slot="MAP_Side" format="rectangle" />
                </div>

                {/* 지도 컴포넌트 */}
                <div className="flex-1 w-full max-w-md">
                    <KoreaMap />
                </div>
            </div>

            <Footer />
        </main>
    );
}
