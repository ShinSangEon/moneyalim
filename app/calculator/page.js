import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import SalaryCalculator from "@/components/calculators/SalaryCalculator";
import UnemploymentCalculator from "@/components/calculators/UnemploymentCalculator";
import SavingsCalculator from "@/components/calculators/SavingsCalculator";

export const metadata = {
    title: "금융 계산기 - 연봉, 실업급여, 적금이자 계산 | MoneyAlim",
    description: "2026년 기준 연봉 실수령액, 실업급여 모의계산, 청년도약계좌 이자 계산을 한 번에! 무료 금융 계산기.",
    openGraph: {
        title: "금융 계산기 | MoneyAlim",
        description: "연봉 실수령액, 실업급여, 적금이자를 한 번에 계산하세요.",
        url: "https://moneyalim.com/calculator",
        type: "website",
    },
};

export default function CalculatorPage() {
    return (
        <main className="min-h-screen bg-[#0f172a] text-white selection:bg-pink-500/30">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="text-center mb-10 animate-fade-in-up">
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                        필수 금융 계산기
                    </h1>
                    <p className="text-slate-400">
                        복잡한 계산은 <strong>MoneyAlim</strong>에게 맡기세요.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* 상단 광고 */}
                    <AdSense slot="CALC_TOP" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 연봉 계산기 */}
                        <SalaryCalculator />

                        <div className="space-y-8">
                            {/* 실업급여 계산기 */}
                            <UnemploymentCalculator />

                            {/* 적금 계산기 */}
                            <SavingsCalculator />
                        </div>
                    </div>

                    {/* 하단 광고 - 계산 결과 보면서 노출 */}
                    <AdSense slot="CALC_BOT" format="autorelaxed" />
                </div>
            </div>

            <Footer />
        </main>
    );
}
