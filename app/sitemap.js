import { getAllSubsidyIds } from "@/lib/prisma";

export default async function sitemap() {
    const baseUrl = 'https://moneyalim.com';

    // 1. 고정 페이지 (priority 차등화)
    const staticRoutes = [
        { route: '', priority: 1.0, changeFrequency: 'daily' },
        { route: '/search', priority: 0.9, changeFrequency: 'daily' },
        { route: '/calendar', priority: 0.8, changeFrequency: 'daily' },
        { route: '/map', priority: 0.7, changeFrequency: 'weekly' },
        { route: '/calculator', priority: 0.7, changeFrequency: 'weekly' },
        { route: '/refund', priority: 0.7, changeFrequency: 'weekly' },
        { route: '/bookmarks', priority: 0.5, changeFrequency: 'weekly' },
        { route: '/about', priority: 0.5, changeFrequency: 'monthly' },
        { route: '/contact', priority: 0.4, changeFrequency: 'monthly' },
        { route: '/terms', priority: 0.3, changeFrequency: 'yearly' },
        { route: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    ].map(({ route, priority, changeFrequency }) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));

    // 2. 동적 페이지 (지원금 상세)
    let subsidyRoutes = [];

    try {
        const dbSubsidies = await getAllSubsidyIds();

        if (dbSubsidies.length > 0) {
            subsidyRoutes = dbSubsidies.map((subsidy) => ({
                url: `${baseUrl}/subsidy/${subsidy.serviceId}`,
                lastModified: subsidy.updatedAt,
                changeFrequency: "weekly",
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error("Sitemap Generation Error:", error);
    }

    return [...staticRoutes, ...subsidyRoutes];
}
