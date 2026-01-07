import { getAllSubsidyIds } from "@/lib/prisma";
import axios from 'axios';

// ... (fetchFromAPI removed or kept as fallback)

export default async function sitemap() {
    const baseUrl = 'https://www.moneyalim.com';

    // 1. 고정 페이지
    const staticRoutes = [
        '',
        '/search',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
    }));

    // 2. 동적 페이지 (지원금 상세)
    let subsidyRoutes = [];

    try {
        // 전체 지원금 ID 가져오기 (1만 개 이상)
        const dbSubsidies = await getAllSubsidyIds();

        if (dbSubsidies.length > 0) {
            subsidyRoutes = dbSubsidies.map((subsidy) => ({
                url: `${baseUrl}/subsidy/${subsidy.serviceId}`,
                lastModified: subsidy.updatedAt,
                changeFrequency: "weekly",
                priority: 0.8,
            }));
        }
        // fallback logic for API if DB is empty can be kept if needed, but dbSubsidies should cover it.
    } catch (error) {
        console.error("Sitemap Generation Error:", error);
    }

    return [...staticRoutes, ...subsidyRoutes];
}
