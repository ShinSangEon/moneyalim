import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const trends = await prisma.searchTerm.findMany({
            take: 10,
            orderBy: {
                count: 'desc',
            },
            // 최근 24시간 or not? 현재는 전체 기간 누적
            // optionally: where: { updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        });

        return NextResponse.json(trends);
    } catch (error) {
        console.error("Failed to fetch trends", error);
        return NextResponse.json([], { status: 500 });
    }
}
