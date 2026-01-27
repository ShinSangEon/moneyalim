"use client";

import { useRouter } from "next/navigation";
import { GraduationCap, Briefcase, Store, Baby, HandCoins, LayoutGrid } from "lucide-react";

export default function CategoryIcons() {
    const router = useRouter();

    const categories = [
        { label: "청년", icon: GraduationCap, color: "bg-blue-100 text-blue-600", query: "status=청년" },
        { label: "직장인", icon: Briefcase, color: "bg-indigo-100 text-indigo-600", query: "status=근로자" },
        { label: "소상공인", icon: Store, color: "bg-orange-100 text-orange-600", query: "status=소상공인" },
        { label: "임신/육아", icon: Baby, color: "bg-pink-100 text-pink-600", query: "status=임신출산" },
        { label: "저소득층", icon: HandCoins, color: "bg-emerald-100 text-emerald-600", query: "status=저소득층" },
        { label: "전체보기", icon: LayoutGrid, color: "bg-slate-100 text-slate-600", query: "" },
    ];

    const handleClick = (query) => {
        if (query) {
            router.push(`/search?${query}`);
        } else {
            router.push("/search");
        }
    };

    return (
        <section className="py-8 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                    {categories.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(item.query)}
                            className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
                        >
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow ${item.color}`}>
                                <item.icon className="w-7 h-7 sm:w-9 sm:h-9 stroke-[1.5]" />
                            </div>
                            <span className="text-sm sm:text-base font-medium text-slate-600 group-hover:text-slate-900">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
