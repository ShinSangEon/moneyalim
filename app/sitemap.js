import { prisma } from '@/lib/prisma';
import axios from 'axios';

// API에서 데이터 가져오는 헬퍼 (DB가 비어있을 때 대비)
async function fetchAllSubsidiesFromAPI() {
    const BASE_URL = 'https://api.odcloud.kr/api';
    const API_KEY = process.env.SUBSIDY_API_KEY;

    try {
        const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
            params: { page: 1, perPage: 1000, serviceKey: API_KEY }, // 최대 1000개
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
        // DB에서 먼저 조회
        const dbSubsidies = await prisma.subsidy.findMany({
            select: { serviceId: true, updatedAt: true },
            take: 1000,
        });

        if (dbSubsidies.length > 0) {
            subsidyRoutes = dbSubsidies.map((subsidy) => ({
                url: `${baseUrl}/subsidy/${subsidy.serviceId}`,
                lastModified: subsidy.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        } else {
            // DB 비어있으면 API fallback
            const apiSubsidies = await fetchAllSubsidiesFromAPI();
            subsidyRoutes = apiSubsidies.map((subsidy) => ({
                url: `${baseUrl}/subsidy/${subsidy.서비스ID}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error('Sitemap Generation Error:', error);
    }

    return [...staticRoutes, ...subsidyRoutes];
}
