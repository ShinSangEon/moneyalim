const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEndDates() {
    try {
        const total = await prisma.subsidy.count();
        const withEndDate = await prisma.subsidy.count({
            where: { endDate: { not: null } }
        });
        const futureEndDates = await prisma.subsidy.count({
            where: {
                endDate: {
                    gte: new Date()
                }
            }
        });

        console.log(`Total Subsidies: ${total}`);
        console.log(`With EndDate: ${withEndDate}`);
        console.log(`Future EndDate: ${futureEndDates}`);

        const samples = await prisma.subsidy.findMany({
            where: { endDate: { not: null } },
            take: 5,
            select: { title: true, period: true, endDate: true }
        });

        console.log('Samples:', samples);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkEndDates();
