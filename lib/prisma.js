import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const globalForPrisma = globalThis;

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 자주 사용되는 필드만 선택하는 상수 (최적화)
export const SUBSIDY_LIST_SELECT = {
  id: true,
  serviceId: true,
  title: true,
  description: true,
  category: true,
  target: true,
  region: true,
  amount: true,
  period: true,
  endDate: true,
  views: true,
  updatedAt: true,
};

// 만료되지 않은 데이터 조건
export const getNotExpiredCondition = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    OR: [{ endDate: null }, { endDate: { gte: today } }],
  };
};

// ============================================
// 캐싱된 쿼리 함수들 (DB 호출 최소화)
// ============================================

// 메인 페이지용 지원금 목록 (5분 캐싱)
export const getCachedSubsidies = unstable_cache(
  async () => {
    const subsidies = await prisma.subsidy.findMany({
      where: getNotExpiredCondition(),
      select: SUBSIDY_LIST_SELECT,
      orderBy: [{ endDate: "asc" }, { updatedAt: "desc" }],
      take: 100,
    });
    return subsidies;
  },
  ["subsidies-list"],
  { revalidate: 300, tags: ["subsidies"] } // 5분 캐싱
);

// 전체 지원금 개수 조회 (5분 캐싱)
export const getCachedTotalCount = unstable_cache(
  async () => {
    const count = await prisma.subsidy.count({
      where: getNotExpiredCondition(),
    });
    return count;
  },
  ["subsidies-count"],
  { revalidate: 300, tags: ["subsidies"] }
);

// Sitemap용 전체 ID 조회 (1시간 캐싱)
export const getAllSubsidyIds = unstable_cache(
  async () => {
    const subsidies = await prisma.subsidy.findMany({
      where: getNotExpiredCondition(),
      select: {
        serviceId: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return subsidies;
  },
  ["all-subsidy-ids"],
  { revalidate: 3600, tags: ["subsidies"] }
);

// 특정 지원금 상세 조회 (10분 캐싱)
export const getCachedSubsidyById = unstable_cache(
  async (id) => {
    const subsidy = await prisma.subsidy.findFirst({
      where: {
        OR: [{ id: id }, { serviceId: id }],
      },
    });
    return subsidy;
  },
  ["subsidy-detail"],
  { revalidate: 600, tags: ["subsidies"] } // 10분 캐싱
);

// 관련 지원금 조회 (5분 캐싱)
export const getCachedRelatedSubsidies = unstable_cache(
  async (currentId, category) => {
    const related = await prisma.subsidy.findMany({
      where: {
        NOT: { serviceId: currentId },
        ...getNotExpiredCondition(),
      },
      select: {
        id: true,
        serviceId: true,
        title: true,
        description: true,
        category: true,
        region: true,
        period: true,
        endDate: true,
        views: true,
      },
      take: 8,
      orderBy: { views: "desc" },
    });

    const sameCategory = related.filter((r) => r.category === category);
    const otherCategory = related.filter((r) => r.category !== category);
    return [...sameCategory, ...otherCategory].slice(0, 4);
  },
  ["related-subsidies"],
  { revalidate: 300, tags: ["subsidies"] }
);

// 조회수 증가 (비동기, 캐싱 안 함)
export const incrementViews = (subsidyId) => {
  prisma.subsidy
    .update({
      where: { id: subsidyId },
      data: { views: { increment: 1 } },
    })
    .catch(() => { });
};
