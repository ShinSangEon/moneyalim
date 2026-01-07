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
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                <Image
                                    src="/logo.png"
                                    alt="MoneyAlim Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                MoneyAlim
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                홈
                            </Link>
                            <Link href="/search" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                지원금 찾기
                            </Link>

                            <Link href="/refund" className="flex items-center gap-1 text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <DollarSign className="w-4 h-4" />
                                숨은 돈 찾기
                            </Link>
                            <Link href="/calculator" className="flex items-center gap-1 text-gray-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <Calculator className="w-4 h-4" />
                                계산기
                            </Link>
                            <Link href="/map" className="flex items-center gap-1 text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <MapPin className="w-4 h-4" />
                                지도
                            </Link>
                            <Link href="/calendar" className="flex items-center gap-1 text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <Calendar className="w-4 h-4" />
                                마감달력
                            </Link>
                            <Link href="/bookmarks" className="flex items-center gap-1 text-gray-300 hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <Heart className="w-4 h-4" />
                                보관함
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
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
                    className="lg:hidden glass border-t border-white/10 overflow-hidden"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {[
                            { href: "/", label: "홈" },
                            { href: "/search", label: "지원금 찾기" },

                            { href: "/refund", label: "숨은 돈 찾기", icon: DollarSign, color: "text-yellow-400" },
                            { href: "/calculator", label: "계산기", icon: Calculator, color: "text-green-400" },
                            { href: "/map", label: "지도", icon: MapPin, color: "text-blue-400" },
                            { href: "/calendar", label: "마감달력", icon: Calendar, color: "text-orange-400" },
                            { href: "/bookmarks", label: "보관함", icon: Heart, color: "text-pink-400" }
                        ].map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-2 group px-3 py-3 rounded-xl text-base font-medium transition-all ${item.color ? `text-gray-300 hover:${item.color} hover:bg-white/5` : "text-gray-300 hover:text-white hover:bg-white/5"
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
