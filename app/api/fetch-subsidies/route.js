import { prisma } from '@/lib/prisma';
import axios from 'axios';

export async function GET(request) {
    const BASE_URL = 'https://api.odcloud.kr/api';
    const API_KEY = process.env.SUBSIDY_API_KEY;

    try {
        let page = 1;
        let totalFetched = 0;
        let hasMore = true;
        const maxPages = 10; // Limit to 10 pages (1000 items)

        const results = [];

        while (hasMore && page <= maxPages) {
            results.push(`📄 Fetching page ${page}...`);

            const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
                params: {
                    page,
                    perPage: 100,
                    serviceKey: API_KEY,
                },
            });

            const services = response.data?.data || [];

            if (!services || services.length === 0) {
                hasMore = false;
                break;
            }

            results.push(`   Found ${services.length} services`);

            for (const service of services) {
                try {
                    const subsidyData = {
                        serviceId: service.서비스ID || `service-${Date.now()}-${Math.random()}`,
                        title: service.서비스명 || '제목 없음',
                        description: (service.서비스목적요약 || service.지원내용 || '').substring(0, 500),
                        category: service.소관기관명 || '기타',
                        target: service.지원대상 || null,
                        region: service.지역구분 || '전국',
                        amount: service.지원내용 || null,
                        startDate: service.신청기간시작일자 ? new Date(service.신청기간시작일자) : null,
                        endDate: service.신청기간종료일자 ? new Date(service.신청기간종료일자) : null,
                        url: service.상세조회URL || null,
                        gov24Url: service.서비스ID ? `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${service.서비스ID}` : null,
                        views: parseInt(service.조회수) || 0,
                    };

                    await prisma.subsidy.upsert({
                        where: { serviceId: subsidyData.serviceId },
                        update: subsidyData,
                        create: subsidyData,
                    });

                    totalFetched++;
                } catch (error) {
                    results.push(`   ❌ Error: ${error.message}`);
                }
            }

            results.push(`   ✅ Processed ${totalFetched} subsidies so far...`);

            if (services.length < 100) {
                hasMore = false;
            } else {
                page++;
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        results.push(`\n✅ Successfully fetched and stored ${totalFetched} subsidies!`);
        results.push(`📊 Total pages processed: ${page - 1}`);

        return new Response(
            `<html>
        <head><title>Data Collection</title></head>
        <body style="font-family: monospace; padding: 20px; background: #0f172a; color: #f8fafc;">
          <h1>🚀 Subsidy Data Collection</h1>
          <pre>${results.join('\n')}</pre>
          <br/>
          <a href="/" style="color: #60a5fa;">← Back to Home</a>
        </body>
      </html>`,
            {
                headers: { 'Content-Type': 'text/html' },
            }
        );

    } catch (error) {
        return new Response(
            `<html>
        <body style="font-family: monospace; padding: 20px; background: #0f172a; color: #f87171;">
          <h1>❌ Error</h1>
          <pre>${error.message}\n\n${error.stack}</pre>
          <br/>
          <a href="/" style="color: #60a5fa;">← Back to Home</a>
        </body>
      </html>`,
            {
                status: 500,
                headers: { 'Content-Type': 'text/html' },
            }
        );
    } finally {
        await prisma.$disconnect();
    }
}
