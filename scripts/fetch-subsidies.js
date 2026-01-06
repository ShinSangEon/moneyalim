require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();
const BASE_URL = 'https://api.odcloud.kr/api';
const API_KEY = process.env.SUBSIDY_API_KEY;

async function fetchServiceList(page = 1, perPage = 100) {
    const response = await axios.get(`${BASE_URL}/gov24/v3/serviceList`, {
        params: {
            page,
            perPage,
            serviceKey: API_KEY,
        },
    });
    return response.data;
}

async function main() {
    console.log('🚀 Starting subsidy data collection...\n');

    try {
        let page = 1;
        let totalFetched = 0;
        let hasMore = true;

        while (hasMore && page <= 10) { // Limit to 10 pages (1000 items) for initial run
            console.log(`📄 Fetching page ${page}...`);

            const response = await fetchServiceList(page, 100);
            const services = response.data || [];

            if (!services || services.length === 0) {
                hasMore = false;
                break;
            }

            console.log(`   Found ${services.length} services`);

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
                        views: parseInt(service.조회수) || 0,
                    };

                    await prisma.subsidy.upsert({
                        where: { serviceId: subsidyData.serviceId },
                        update: subsidyData,
                        create: subsidyData,
                    });

                    totalFetched++;
                    if (totalFetched % 100 === 0) {
                        console.log(`   ✅ Processed ${totalFetched} subsidies...`);
                    }
                } catch (error) {
                    console.error(`   ❌ Error processing service:`, error.message);
                }
            }

            if (services.length < 100) {
                hasMore = false;
            } else {
                page++;
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`\n✅ Successfully fetched and stored ${totalFetched} subsidies!`);
        console.log(`📊 Total pages processed: ${page - 1}`);

    } catch (error) {
        console.error('\n❌ Error during data collection:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
