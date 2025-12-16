import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "개인정보처리방침 | MoneyAlim",
    description: "MoneyAlim의 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-300">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-32">
                <h1 className="text-3xl font-bold text-white mb-8">개인정보처리방침</h1>

                <div className="space-y-8 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. 개인정보의 처리 목적</h2>
                        <p>MoneyAlim(이하 '회사')은(는) 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>서비스 제공: 정부지원금 정보 제공 및 맞춤형 콘텐츠 추천</li>
                            <li>광고 게재: Google AdSense 등을 통한 맞춤형 광고 제공</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. 쿠키(Cookie)의 운용 및 거부</h2>
                        <p>회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.</p>
                        <p className="mt-2">쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>쿠키의 사용 목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.</li>
                            <li>쿠키의 설치·운영 및 거부: 웹브라우저 상단의 도구&gt;인터넷 옵션&gt;개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.</li>
                            <li>다만, 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Google AdSense 광고</h2>
                        <p>본 사이트는 Google AdSense 광고를 게재하고 있습니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Google 등 타사 공급업체는 쿠키를 사용하여 사용자가 해당 웹사이트나 다른 웹사이트를 과거에 방문한 내역을 바탕으로 광고를 게재합니다.</li>
                            <li>Google은 광고 쿠키를 사용하여 사용자가 해당 사이트나 인터넷의 다른 사이트를 방문한 내역을 바탕으로 사용자에게 적절한 광고를 게재할 수 있습니다.</li>
                            <li>사용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">광고 설정</a>에서 맞춤 광고를 사용 중지할 수 있습니다.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. 개인정보의 파기</h2>
                        <p>회사는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체 없이 해당 개인정보를 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. 문의처</h2>
                        <p>개인정보 및 서비스 이용과 관련된 문의사항은 아래 연락처로 문의주시기 바랍니다.</p>
                        <p className="mt-2">이메일: contact@moneyalim.com (예시)</p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
