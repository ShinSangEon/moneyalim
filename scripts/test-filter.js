const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Removed import, defining manually below

// Mocking the API logic briefly to test query construction
async function testRegionFilter(regionName) {
    console.log(`Testing filter for: ${regionName}`);

    // Logic from route.js
    const otherRegions = [
        "서울", "부산", "대구", "인천", "광주", "대전", "울산",
        "세종", "경기", "강원", "충북", "충남", "전북", "전남",
        "경북", "경남", "제주"
    ].filter(r => r !== regionName && r !== '전국' && r !== '전체');

    const where = {
        AND: [
            {
                OR: [
                    { region: { contains: regionName } },
                    {
                        AND: [
                            { OR: [{ region: '전국' }, { region: null }] },
                            {
                                NOT: {
                                    OR: otherRegions.map(r => ({ category: { contains: r } }))
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };

    const count = await prisma.subsidy.count({ where });
    console.log(`Found ${count} items for ${regionName}`);

    // Check for false positives (e.g. searching Chungbuk but getting Gwangju)
    if (regionName === '충북') {
        const falsePositives = await prisma.subsidy.findMany({
            where: {
                ...where,
                category: { contains: '광주' }
            },
            select: { title: true, category: true, region: true }
        });
        if (falsePositives.length > 0) {
            console.log("❌ False positives found:", falsePositives);
        } else {
            console.log("✅ No matching false positives (e.g. Gwangju items in Chungbuk search)");
        }
    }
}

async function run() {
    await testRegionFilter('충북');
    await prisma.$disconnect();
}

run();
