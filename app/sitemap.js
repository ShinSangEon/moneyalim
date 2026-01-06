<<<<<<< HEAD
import { getCachedSubsidies } from "@/lib/prisma";
import axios from 'axios';

// sitemap은 자주 변경되지 않으므로 1시간마다 재생성 (빌드 시 캐싱)
export const revalidate = 3600; // 1시간

=======
import { prisma } from '@/lib/prisma';
import axios from 'axios';

>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
// API에서 데이터 가져오는 헬퍼 (DB가 비어있을 때 대비)
async function fetchAllSubsidiesFromAPI() {
    const BASE_URL = 'https://api.odcloud.kr/api';
    const API_KEY = process.env.SUBSIDY_API_KEY;

    try {
        const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
<<<<<<< HEAD
            params: { page: 1, perPage: 500, serviceKey: API_KEY }, // 500개로 제한
=======
            params: { page: 1, perPage: 1000, serviceKey: API_KEY }, // 최대 1000개
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
        });
        return response.data?.data || [];
    } catch (error) {
        console.error('Sitemap API Error:', error);
        return [];
    }
}

export default async function sitemap() {
    const baseUrl = 'https://moneyalim.com';

    // 1. 고정 페이지
    const staticRoutes = [
        '',
        '/search',
        '/refund',
        '/calculator',
        '/map',
        '/bookmarks',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
    }));

    // 2. 동적 페이지 (지원금 상세)
    let subsidyRoutes = [];

    try {
<<<<<<< HEAD
        // 캐싱된 데이터 사용 (메인 페이지와 동일한 캐시 재사용)
        const dbSubsidies = await getCachedSubsidies();
=======
        // DB에서 먼저 조회
        const dbSubsidies = await prisma.subsidy.findMany({
            select: { serviceId: true, updatedAt: true },
            take: 1000,
        });
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4

        if (dbSubsidies.length > 0) {
            subsidyRoutes = dbSubsidies.map((subsidy) => ({
                url: `${baseUrl}/subsidy/${subsidy.serviceId}`,
                lastModified: subsidy.updatedAt,
<<<<<<< HEAD
                changeFrequency: "weekly",
                priority: 0.8,
            }));
        } else {
=======
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        } else {
            // DB 비어있으면 API fallback
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
            const apiSubsidies = await fetchAllSubsidiesFromAPI();
            subsidyRoutes = apiSubsidies.map((subsidy) => ({
                url: `${baseUrl}/subsidy/${subsidy.서비스ID}`,
                lastModified: new Date(),
<<<<<<< HEAD
                changeFrequency: "weekly",
=======
                changeFrequency: 'weekly',
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
                priority: 0.8,
            }));
        }
    } catch (error) {
<<<<<<< HEAD
        console.error("Sitemap Generation Error:", error);
=======
        console.error('Sitemap Generation Error:', error);
>>>>>>> 3f4ca692e40e5929e561822bcbe335956b9daaf4
    }

    return [...staticRoutes, ...subsidyRoutes];
}
