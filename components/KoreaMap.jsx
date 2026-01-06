"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// 타일형 지도 데이터 (Cartogram style)
const REGIONS = [
    { name: "서울", x: 1, y: 0, color: "bg-red-500" },
    { name: "경기", x: 1, y: 1, color: "bg-orange-500" },
    { name: "인천", x: 0, y: 1, color: "bg-blue-500" },
    { name: "강원", x: 2, y: 0, color: "bg-emerald-500" },

    { name: "충남", x: 0, y: 2, color: "bg-yellow-500" },
    { name: "세종", x: 1, y: 2, color: "bg-indigo-500" },
    { name: "충북", x: 2, y: 1, color: "bg-lime-500" },
    { name: "대전", x: 1, y: 3, color: "bg-violet-500" },
    { name: "경북", x: 2, y: 2, color: "bg-cyan-500" },

    { name: "전북", x: 0, y: 3, color: "bg-rose-500" },
    { name: "대구", x: 2, y: 3, color: "bg-teal-500" },

    { name: "광주", x: 0, y: 4, color: "bg-fuchsia-500" },
    { name: "경남", x: 1, y: 4, color: "bg-sky-500" },
    { name: "울산", x: 3, y: 3, color: "bg-amber-500" },
    { name: "부산", x: 2, y: 4, color: "bg-blue-600" },

    { name: "전남", x: 0, y: 5, color: "bg-purple-500" },
    { name: "제주", x: 1, y: 6, color: "bg-emerald-600" },
];

export default function KoreaMap() {
    const router = useRouter();

    return (
        <div className="relative w-full max-w-sm mx-auto aspect-[3/5] bg-slate-900/50 rounded-2xl p-8 border border-white/10">
            <div className="grid grid-cols-4 gap-3 h-full">
                {REGIONS.map((region) => (
                    <motion.button
                        key={region.name}
                        onClick={() => router.push(`/search?region=${encodeURIComponent(region.name)}`)}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                            relative rounded-xl flex items-center justify-center font-bold text-white shadow-lg cursor-pointer
                            ${region.color} hover:brightness-110 transition-all border border-white/20
                        `}
                        style={{
                            gridColumnStart: region.x + 1,
                            gridRowStart: region.y + 1,
                            aspectRatio: '1/1'
                        }}
                    >
                        {region.name}
                    </motion.button>
                ))}
            </div>

            <div className="absolute top-4 right-4 text-xs text-slate-500">
                Data Map
            </div>
        </div>
    );
}
