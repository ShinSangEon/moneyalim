"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calculator } from "lucide-react";

export default function UnemploymentCalculator() {
    const [age, setAge] = useState(30);
    const [duration, setDuration] = useState(3); // Years
    const [avgSalary, setAvgSalary] = useState(3000000);
    const [result, setResult] = useState(null);

    const calculate = () => {
        // 실업급여 로직 (2024년 기준 상한액 66,000, 하한액 63,104)
        const dailyLimit = 66000;
        const dailyMin = 63104;

        // 평균임금의 60%
        let dailyWage = (avgSalary / 30) * 0.6;
        if (dailyWage > dailyLimit) dailyWage = dailyLimit;
        if (dailyWage < dailyMin) dailyWage = dailyMin; // 대략적용

        // 소정급여일수 (나이 & 가입기간)
        // 50세 미만: 1년미만(120), 1-3(150), 3-5(180), 5-10(210), 10이상(240)
        let days = 120;
        if (duration < 1) days = 120;
        else if (duration < 3) days = 150;
        else if (duration < 5) days = 180;
        else if (duration < 10) days = 210;
        else days = 240;

        // 50세 이상이거나 장애인은 +30일 (간단화)
        if (age >= 50) days += 30;

        const total = dailyWage * days;

        setResult({
            daily: Math.floor(dailyWage),
            days: days,
            total: Math.floor(total)
        });
    };

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-400" />
                실업급여 모의계산
            </h3>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">나이 (만)</label>
                        <input
                            type="number" value={age} onChange={(e) => setAge(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">고용보험 가입기간 (년)</label>
                        <input
                            type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-2">직전 3개월 월 평균 급여</label>
                    <input
                        type="number" value={avgSalary} onChange={(e) => setAvgSalary(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-1 text-right text-xs text-slate-500">{avgSalary.toLocaleString()} 원</div>
                </div>

                <button
                    onClick={calculate}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all active:scale-95 mt-4"
                >
                    계산하기
                </button>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gradient-to-br from-blue-900/50 to-slate-900 rounded-xl p-6 border border-blue-500/30 text-center"
                        >
                            <p className="text-slate-300 text-sm mb-2">예상 총 지급액 (약 {result.days}일간)</p>
                            <h4 className="text-3xl font-extrabold text-blue-300 mb-4">
                                {result.total.toLocaleString()} 원
                            </h4>
                            <div className="inline-block bg-slate-900/80 rounded-lg px-4 py-2 text-xs text-slate-400">
                                1일 구직급여일액: <span className="text-white font-bold">{result.daily.toLocaleString()}원</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
