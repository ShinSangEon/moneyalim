const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.subsidy.groupBy({
        by: ['category'],
        _count: {
            category: true,
        },
    });

    console.log('Categories in DB:');
    categories.forEach(c => {
        console.log(`${c.category}: ${c._count.category}`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
