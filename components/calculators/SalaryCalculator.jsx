"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, ArrowRight, RefreshCw } from "lucide-react";

export default function SalaryCalculator() {
    const [salary, setSalary] = useState(30000000); // Default 3000
    const [result, setResult] = useState(null);

    const calculate = () => {
        // 2024/2026 기준 대략적 계산 (간이세액표)
        // 국민연금 4.5%, 건강보험 3.545%, 장기요양(건보의 12.95%), 고용보험 0.9%
        // 소득세: 간이세액 (대략적)

        const monthly = salary / 12;
        const pension = monthly * 0.045;
        const health = monthly * 0.03545;
        const care = health * 0.1295;
        const employment = monthly * 0.009;

        // 소득세 (약식 - 과세표준 구간별)
        let incomeTax = 0;
        if (monthly < 1060000) incomeTax = 0;
        else if (monthly < 5000000) incomeTax = monthly * 0.03; // Simple avg
        else incomeTax = monthly * 0.06;

        const localIncomeTax = incomeTax * 0.1;

        const totalDeduction = pension + health + care + employment + incomeTax + localIncomeTax;
        const netPay = monthly - totalDeduction;

        setResult({
            monthly: Math.floor(monthly),
            pension: Math.floor(pension),
            health: Math.floor(health + care),
            employment: Math.floor(employment),
            tax: Math.floor(incomeTax + localIncomeTax),
            netPay: Math.floor(netPay)
        });
    };

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                2026 연봉 실수령액 계산기
            </h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm text-slate-400 mb-2">연봉 (원)</label>
                    <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono"
                        placeholder="예: 30000000"
                    />
                    <div className="mt-2 text-right text-sm text-yellow-400 font-medium">
                        {salary.toLocaleString()} 원
                    </div>
                </div>

                <button
                    onClick={calculate}
                    className="w-full bg-green-500 hover:bg-green-600 text-slate-900 font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    실수령액 계산하기
                </button>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-900 rounded-xl p-5 border border-green-500/30 overflow-hidden"
                        >
                            <div className="text-center mb-6">
                                <span className="text-slate-400 text-sm">예상 월 실수령액</span>
                                <div className="text-4xl font-extrabold text-white mt-1">
                                    {result.netPay.toLocaleString()} <span className="text-2xl text-slate-500 font-medium">원</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-slate-400">
                                    <span>월 세전 급여</span>
                                    <span>{result.monthly.toLocaleString()} 원</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between text-red-400">
                                    <span>국민연금</span>
                                    <span>-{result.pension.toLocaleString()} 원</span>
                                </div>
                                <div className="flex justify-between text-red-400">
                                    <span>건강보험(장기요양 포함)</span>
                                    <span>-{result.health.toLocaleString()} 원</span>
                                </div>
                                <div className="flex justify-between text-red-400">
                                    <span>고용보험</span>
                                    <span>-{result.employment.toLocaleString()} 원</span>
                                </div>
                                <div className="flex justify-between text-red-400">
                                    <span>소득세(지방세 포함)</span>
                                    <span>-{result.tax.toLocaleString()} 원</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
