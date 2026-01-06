import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "이용약관 | MoneyAlim",
    description: "MoneyAlim의 서비스 이용약관입니다.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-300">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-32">
                <h1 className="text-3xl font-bold text-white mb-8">이용약관</h1>

                <div className="space-y-8 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">제1조 (목적)</h2>
                        <p>본 약관은 MoneyAlim(이하 '회사')이 제공하는 정부지원금 찾기 및 관련 제반 서비스(이하 '서비스')의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">제2조 (정보의 제공 및 책임의 한계)</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>본 서비스는 공공데이터포털 등을 통해 공개된 정보를 바탕으로 사용자가 보기 쉽게 가공하여 제공하는 정보 제공 서비스입니다.</li>
                            <li>회사는 제공하는 정보의 정확성, 완전성, 신뢰성을 보장하기 위해 노력하지만, 정부 정책의 변경이나 데이터 갱신 지연 등으로 인해 실제 내용과 다를 수 있습니다.</li>
                            <li>따라서 본 서비스가 제공하는 정보만을 믿고 행한 투자나 결정에 대한 책임은 이용자 본인에게 있으며, 회사는 이에 대해 법적인 책임을 지지 않습니다.</li>
                            <li>정확한 신청 자격 및 절차는 반드시 해당 기관의 공식 문의처를 통해 최종 확인하시기 바랍니다.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">제3조 (저작권의 귀속 및 이용제한)</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.</li>
                            <li>이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">제4조 (광고의 게재)</h2>
                        <p>회사는 서비스 운영과 관련하여 서비스 화면, 홈페이지, 이메일 등에 광고를 게재할 수 있습니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">부칙</h2>
                        <p>본 약관은 2025년 12월 16일부터 시행됩니다.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
