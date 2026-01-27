"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Heart, Calendar, DollarSign, Calculator, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                                <DollarSign className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-slate-900 leading-none tracking-tight">
                                    머니알림
                                </span>
                                <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase leading-none mt-0.5">
                                    MONEY ALIM
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                홈
                            </Link>
                            <Link href="/search" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                지원금 찾기
                            </Link>

                            <Link href="/refund" className="flex items-center gap-1 text-slate-600 hover:text-yellow-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <DollarSign className="w-4 h-4" />
                                숨은 돈 찾기
                            </Link>
                            <Link href="/calculator" className="flex items-center gap-1 text-slate-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <Calculator className="w-4 h-4" />
                                계산기
                            </Link>
                            <Link href="/map" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <MapPin className="w-4 h-4" />
                                지도
                            </Link>
                            <Link href="/calendar" className="flex items-center gap-1 text-slate-600 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <Calendar className="w-4 h-4" />
                                마감달력
                            </Link>
                            <Link href="/bookmarks" className="flex items-center gap-1 text-slate-600 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <Heart className="w-4 h-4" />
                                보관함
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-lg"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {[
                            { href: "/", label: "홈" },
                            { href: "/search", label: "지원금 찾기" },

                            { href: "/refund", label: "숨은 돈 찾기", icon: DollarSign, color: "text-yellow-600" },
                            { href: "/calculator", label: "계산기", icon: Calculator, color: "text-green-600" },
                            { href: "/map", label: "지도", icon: MapPin, color: "text-blue-600" },
                            { href: "/calendar", label: "마감달력", icon: Calendar, color: "text-orange-600" },
                            { href: "/bookmarks", label: "보관함", icon: Heart, color: "text-pink-600" }
                        ].map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-2 group px-3 py-3 rounded-xl text-base font-medium transition-all ${item.color ? `text-slate-600 hover:${item.color} hover:bg-slate-50` : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon && <item.icon className={`w-5 h-5 ${item.color && `group-hover:${item.color}`}`} />}
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
