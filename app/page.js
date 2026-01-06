import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchFilter from "@/components/SearchFilter";
import SubsidyCard from "@/components/SubsidyCard";
import Footer from "@/components/Footer";
<<<<<<< HEAD
import { getCachedSubsidies } from "@/lib/prisma";
=======
import { prisma } from "@/lib/prisma";
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
import axios from "axios";
import FloatingAds from "@/components/FloatingAds";
import AdSense from "@/components/AdSense";

// API에서 직접 가져오기 (DB가 비어있을 때 fallback)
async function fetchFromAPI() {
<<<<<<< HEAD
  const BASE_URL = "https://api.odcloud.kr/api";
=======
  const BASE_URL = 'https://api.odcloud.kr/api';
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
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

<<<<<<< HEAD
    return services.map((service) => {
      const serviceId = service.서비스ID || "";
      const serviceName = service.서비스명 || "";
=======
    return services.map(service => {
      const serviceId = service.서비스ID || '';
      const serviceName = service.서비스명 || '';
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4

      return {
        id: serviceId || `temp-${Math.random()}`,
        serviceId: serviceId,
<<<<<<< HEAD
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
=======
        title: serviceName || '제목 없음',
        description: service.서비스목적요약 || service.지원내용 || '',
        category: service.소관기관명 || '기타',
        target: service.지원대상 || '전국민',
        region: service.지역구분 || '전국',
        amount: service.지원내용 || '금액 미정',
        period: service.신청기한내용 || '상시신청',
        fullDescription: service.지원내용 || '',
        requirements: service.선정기준내용 || '',
        applicationMethod: service.신청방법내용 || '',
        requiredDocs: service.구비서류내용 || '',
        contactInfo: service.문의처전화번호 || '',
        hostOrg: service.소관기관명 || '',
        serviceUrl: service.온라인신청사이트URL || null,
        gov24Url: serviceId ? `https://www.gov.kr/portal/service/serviceInfo/${serviceId}` : null,
        searchUrl: serviceName ? `https://www.google.com/search?q=${encodeURIComponent(serviceName + ' 신청')}` : null,
      };
    });
  } catch (error) {
    console.error('API 호출 실패:', error);
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
    return [];
  }
}

export default async function Home() {
  let subsidies = [];
<<<<<<< HEAD
  let source = "unknown";

  try {
    // 5분간 캐싱된 데이터 사용 (DB 쿼리 최소화)
    subsidies = await getCachedSubsidies();

    if (subsidies.length > 0) {
      source = "database";
    } else {
      console.log("⚠️ DB가 비어있어 API에서 직접 가져옵니다.");
      subsidies = await fetchFromAPI();
      source = "api";
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    subsidies = await fetchFromAPI();
    source = "api-fallback";
=======
  let source = 'unknown';
  let dbCount = 0;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // DB에서 유효한(만료되지 않은) 데이터 수 확인
    dbCount = await prisma.subsidy.count({
      where: {
        OR: [
          { endDate: null }, // 상시
          { endDate: { gte: today } }, // 아직 안 만료됨
        ],
      },
    });

    if (dbCount > 0) {
      // DB에서 만료되지 않은 데이터만 가져오기
      subsidies = await prisma.subsidy.findMany({
        where: {
          OR: [
            { endDate: null }, // 상시
            { endDate: { gte: today } }, // 아직 안 만료됨
          ],
        },
        orderBy: [
          { endDate: 'asc' }, // 마감 임박순
          { updatedAt: 'desc' },
        ],
        take: 100,
      });
      source = 'database';
    } else {
      // DB가 비어있으면 API에서 직접 가져오기
      console.log('⚠️ DB가 비어있어 API에서 직접 가져옵니다.');
      subsidies = await fetchFromAPI();
      source = 'api';
    }
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    // DB 연결 실패 시 API fallback
    subsidies = await fetchFromAPI();
    source = 'api-fallback';
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
  }

  return (
    <main className="min-h-screen bg-[#0f172a] selection:bg-blue-500/30">
      <Navbar />
      <FloatingAds />
<<<<<<< HEAD
      <Hero totalCount={subsidies.length} />
      <SearchFilter />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
=======
      <Hero totalCount={dbCount} />
      <SearchFilter />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Show all subsidies */}
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
            🔥 실시간 정부지원금
          </h2>
          <div className="text-right">
            <span className="text-sm text-slate-400">
              총 {subsidies.length}개
            </span>
<<<<<<< HEAD
            {source === "api" && (
=======
            {source === 'api' && (
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
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

<<<<<<< HEAD
=======
        {/* 하단 광고 */}
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
        <div className="mt-20 mb-10 text-center">
          <AdSense slot="MAIN_BOTTOM" format="autorelaxed" />
        </div>
      </div>

      <Footer />
    </main>
  );
}
