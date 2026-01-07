import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchFilter from "@/components/SearchFilter";
import SubsidyCard from "@/components/SubsidyCard";
import Footer from "@/components/Footer";
import { getCachedSubsidies, getCachedTotalCount } from "@/lib/prisma";
import axios from "axios";
import FloatingAds from "@/components/FloatingAds";
import AdSense from "@/components/AdSense";

// API에서 직접 가져오기 (DB가 비어있을 때 fallback)
async function fetchFromAPI() {
  const BASE_URL = "https://api.odcloud.kr/api";
  const API_KEY = process.env.SUBSIDY_API_KEY;

  try {
    const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
      params: {
        page: 1,
        perPage: 100,
        serviceKey: API_KEY,
      },
    });

    const services = response.data?.data || [];

    return services.map((service) => {
      const serviceId = service.서비스ID || "";
      const serviceName = service.서비스명 || "";

      return {
        id: serviceId || `temp-${Math.random()}`,
        serviceId: serviceId,
        title: serviceName || "제목 없음",
        description: service.서비스목적요약 || service.지원내용 || "",
        category: service.소관기관명 || "기타",
        target: service.지원대상 || "전국민",
        region: service.지역구분 || "전국",
        amount: service.지원내용 || "금액 미정",
        period: service.신청기한내용 || "상시신청",
      };
    });
  } catch (error) {
    console.error("API 호출 실패:", error);
    return [];
  }
}

export default async function Home() {
  let subsidies = [];
  let totalCount = 0;
  let source = "unknown";

  try {
    // 5분간 캐싱된 데이터 사용 (DB 쿼리 최소화)
    // 리스트와 전체 개수를 병렬로 조회
    const [list, count] = await Promise.all([
      getCachedSubsidies(),
      getCachedTotalCount()
    ]);

    subsidies = list;
    totalCount = count;

    if (subsidies.length > 0) {
      source = "database";
    } else {
      console.log("⚠️ DB가 비어있어 API에서 직접 가져옵니다.");
      subsidies = await fetchFromAPI();
      totalCount = subsidies.length; // API fallback 시에는 리스트 개수만
      source = "api";
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    subsidies = await fetchFromAPI();
    totalCount = subsidies.length;
    source = "api-fallback";
  }

  return (
    <main className="min-h-screen bg-[#0f172a] selection:bg-blue-500/30">
      <Navbar />
      {/* <FloatingAds /> - 승인 전 비활성화 */}
      <Hero totalCount={totalCount} />
      <SearchFilter />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
            🔥 실시간 정부지원금
          </h2>
          <div className="text-right">
            <span className="text-sm text-slate-400">
              총 {totalCount}개
            </span>
            {source === "api" && (
              <p className="text-xs text-amber-400">
                ⚠️ DB 동기화 필요 - /admin/sync
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subsidies.slice(0, 12).map((subsidy, index) => (
            <SubsidyCard key={subsidy.id} subsidy={subsidy} index={index} />
          ))}
        </div>

        {subsidies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">데이터가 없습니다.</p>
            <a
              href="/admin/sync"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              데이터 동기화 하러 가기 →
            </a>
          </div>
        )}

        {/* 
        <div className="mt-20 mb-10 text-center">
          <AdSense slot="MAIN_BOTTOM" format="autorelaxed" />
        </div> 
        */}
      </div>

      <Footer />
    </main>
  );
}
