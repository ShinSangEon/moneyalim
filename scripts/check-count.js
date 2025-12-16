const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCount() {
    try {
        const count = await prisma.subsidy.count();
        console.log(`Total Subsidies: ${count}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkCount();
