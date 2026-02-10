"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Briefcase, Search, Store, Baby, HandCoins, Accessibility, Globe, Shield, Backpack } from "lucide-react";

const TARGET_OPTIONS = [
    { label: "청년", value: "청년", icon: GraduationCap, emoji: "🎓", color: "from-blue-500 to-blue-600", bg: "bg-blue-50 hover:bg-blue-100", border: "border-blue-200", text: "text-blue-700" },
    { label: "학생", value: "학생", icon: Backpack, emoji: "🎒", color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50 hover:bg-indigo-100", border: "border-indigo-200", text: "text-indigo-700" },
    { label: "구직자", value: "구직자", icon: Search, emoji: "🔍", color: "from-violet-500 to-violet-600", bg: "bg-violet-50 hover:bg-violet-100", border: "border-violet-200", text: "text-violet-700" },
    { label: "직장인", value: "근로자", icon: Briefcase, emoji: "💼", color: "from-sky-500 to-sky-600", bg: "bg-sky-50 hover:bg-sky-100", border: "border-sky-200", text: "text-sky-700" },
    { label: "소상공인", value: "소상공인", icon: Store, emoji: "🏪", color: "from-orange-500 to-orange-600", bg: "bg-orange-50 hover:bg-orange-100", border: "border-orange-200", text: "text-orange-700" },
    { label: "저소득층", value: "저소득층", icon: HandCoins, emoji: "💰", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50 hover:bg-emerald-100", border: "border-emerald-200", text: "text-emerald-700" },
    { label: "임산부/육아", value: "임신출산", icon: Baby, emoji: "🤰", color: "from-pink-500 to-pink-600", bg: "bg-pink-50 hover:bg-pink-100", border: "border-pink-200", text: "text-pink-700" },
    { label: "장애인", value: "장애인", icon: Accessibility, emoji: "🤝", color: "from-teal-500 to-teal-600", bg: "bg-teal-50 hover:bg-teal-100", border: "border-teal-200", text: "text-teal-700" },
    { label: "다문화", value: "다문화", icon: Globe, emoji: "🌏", color: "from-amber-500 to-amber-600", bg: "bg-amber-50 hover:bg-amber-100", border: "border-amber-200", text: "text-amber-700" },
];

export default function SubsidyTargetModal({ isOpen, onClose }) {
    const router = useRouter();

    const handleSelect = (value) => {
        onClose();
        router.push(`/search?status=${encodeURIComponent(value)}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 배경 오버레이 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* 모달 컨텐츠 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 헤더 그라데이션 */}
                            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 pt-7 pb-6">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="text-white">
                                    <p className="text-sm font-medium text-white/70 mb-1">맞춤 지원금 탐색</p>
                                    <h2 className="text-xl font-bold">어떤 지원이 필요하세요?</h2>
                                    <p className="text-sm text-white/60 mt-1.5">나에게 해당하는 항목을 선택해주세요</p>
                                </div>
                            </div>

                            {/* 타겟 옵션 그리드 */}
                            <div className="p-5">
                                <div className="grid grid-cols-3 gap-3">
                                    {TARGET_OPTIONS.map((option, index) => (
                                        <motion.button
                                            key={option.value}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            onClick={() => handleSelect(option.value)}
                                            className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl border ${option.border} ${option.bg} transition-all duration-200 active:scale-95`}
                                        >
                                            <span className="text-2xl">{option.emoji}</span>
                                            <span className={`text-sm font-bold ${option.text}`}>
                                                {option.label}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* 전체보기 버튼 */}
                                <button
                                    onClick={() => { onClose(); router.push('/search'); }}
                                    className="w-full mt-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-colors active:scale-[0.98]"
                                >
                                    전체 지원금 보기 →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
