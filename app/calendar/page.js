import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar as CalendarIcon, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { extractDeadline, mapCategory } from "@/lib/utils";

// 날짜 포맷팅 (YYYY.MM.DD)
function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// 요일 구하기
function getDayName(date) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[new Date(date).getDay()];
}

async function getUrgentSubsidies() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 45); // 45일치

    const subsidies = await prisma.subsidy.findMany({
        where: {
            endDate: {
                gte: today, // 오늘 이후
                lte: nextMonth, // 45일 이내
            }
        },
        orderBy: {
            endDate: 'asc',
        }
    });

    return subsidies;
}

export default async function CalendarPage() {
    const subsidies = await getUrgentSubsidies();

    // 그룹화 로직
    const groups = [];
    let currentGroup = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    subsidies.forEach(subsidy => {
        if (!subsidy.endDate) return;

        const end = new Date(subsidy.endDate);
        end.setHours(0, 0, 0, 0);

        const diffTime = end - today;
        const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 그룹 키 결정
        let groupKey = "";
        let groupLabel = "";
        let groupColor = "";

        if (dDay === 0) {
            groupKey = "today";
            groupLabel = "오늘 마감! 🚨";
            groupColor = "text-red-500";
        } else if (dDay === 1) {
            groupKey = "tomorrow";
            groupLabel = "내일 마감";
            groupColor = "text-orange-500";
        } else if (dDay <= 7) {
            groupKey = "week";
            groupLabel = "이번 주 마감";
            groupColor = "text-yellow-400";
        } else {
            groupKey = "later";
            groupLabel = "이달의 마감 예정";
            groupColor = "text-blue-400";
        }

        // 새 그룹 시작?
        if (!currentGroup || currentGroup.key !== groupKey) {
            if (currentGroup) groups.push(currentGroup);
            currentGroup = {
                key: groupKey,
                label: groupLabel,
                color: groupColor,
                items: []
            };
        }
        currentGroup.items.push(subsidy);
    });
    if (currentGroup) groups.push(currentGroup);

    return (
        <main className="min-h-screen bg-[#0f172a] text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-6">
                        <CalendarIcon className="w-8 h-8 text-orange-500" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">마감 임박 캘린더</h1>
                    <p className="text-slate-400 text-lg">
                        놓치면 후회할 지원금, 마감일별로 확인하세요.
                    </p>
                </div>

                <div className="space-y-12">
                    {groups.length > 0 ? (
                        groups.map((group, groupIdx) => (
                            <div key={groupIdx} className="relative animate-fade-in-up" style={{ animationDelay: `${groupIdx * 100}ms` }}>
                                {/* 타임라인 선 */}
                                {groupIdx !== groups.length - 1 && (
                                    <div className="absolute left-4 top-12 bottom-[-48px] w-0.5 bg-white/10 hidden sm:block"></div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* 날짜/헤더 */}
                                    <div className="sm:w-32 flex-shrink-0 pt-2">
                                        <h2 className={`text-xl font-bold ${group.color} flex items-center gap-2`}>
                                            {group.key === 'today' && <AlertCircle className="w-5 h-5 animate-pulse" />}
                                            {group.label}
                                        </h2>
                                    </div>

                                    {/* 리스트 */}
                                    <div className="flex-1 space-y-4">
                                        {group.items.map((subsidy) => {
                                            const category = mapCategory(subsidy.category);
                                            return (
                                                <Link
                                                    href={`/subsidy/${subsidy.id}`}
                                                    key={subsidy.id}
                                                    className="block group bg-slate-800/40 border border-white/5 rounded-2xl p-5 hover:bg-slate-800/80 hover:border-blue-500/30 transition-all duration-300"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2 text-xs">
                                                                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                                                                    {category}
                                                                </span>
                                                                <span className="text-slate-500 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {formatDate(subsidy.endDate)} ({getDayName(subsidy.endDate)}) 마감
                                                                </span>
                                                            </div>
                                                            <h3 className="font-bold text-lg text-slate-200 group-hover:text-blue-300 transition-colors mb-2 line-clamp-1">
                                                                {subsidy.title}
                                                            </h3>
                                                            <p className="text-sm text-slate-500 line-clamp-1">
                                                                {subsidy.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex-shrink-0 self-center">
                                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-white/5">
                            <p className="text-slate-400 text-lg">당분간 마감 예정인 지원금이 없습니다 🎉</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
