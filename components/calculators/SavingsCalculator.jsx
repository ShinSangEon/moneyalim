"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, PiggyBank } from "lucide-react";

export default function SavingsCalculator() {
    const [amount, setAmount] = useState(700000); // 70만원 (청년도약계좌 기준)
    const [rate, setRate] = useState(6.0);
    const [months, setMonths] = useState(60);
    const [type, setType] = useState('simple'); // simple, compound
    const [result, setResult] = useState(null);

    const calculate = () => {
        let totalPrincipal = amount * months;
        let totalInterest = 0;

        if (type === 'simple') {
            // 단리: 원금 * 연이율 * (기간/12) 의 합?
            // 적금 단리 공식: 월납입액 * 이율/12 * (개월수*(개월수+1)/2)
            totalInterest = amount * (rate / 100 / 12) * (months * (months + 1) / 2);
        } else {
            // 월복리: 원금 * (1 + r)^n ... 매월 납입이므로 등비수열 합
            const r = rate / 100 / 12;
            totalInterest = amount * ((Math.pow(1 + r, months + 1) - (1 + r)) / r) - totalPrincipal;
        }

        // 이자소득세 15.4%
        const tax = totalInterest * 0.154;
        const netInterest = totalInterest - tax;

        setResult({
            principal: totalPrincipal,
            interest: Math.floor(totalInterest),
            tax: Math.floor(tax),
            netInterest: Math.floor(netInterest),
            total: Math.floor(totalPrincipal + netInterest)
        });
    };

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <PiggyBank className="w-6 h-6 text-pink-400" />
                적금/목돈 계산기
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-2">월 납입금액</label>
                    <input
                        type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="mt-1 text-right text-xs text-slate-500">{amount.toLocaleString()} 원</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">연 이자율 (%)</label>
                        <input
                            type="number" value={rate} step="0.1" onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">적립 기간 (개월)</label>
                        <input
                            type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>

                <div className="flex gap-2 p-1 bg-slate-900 rounded-lg">
                    <button
                        onClick={() => setType('simple')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${type === 'simple' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        단리
                    </button>
                    <button
                        onClick={() => setType('compound')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${type === 'compound' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        월복리
                    </button>
                </div>

                <button
                    onClick={calculate}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-all active:scale-95 mt-2"
                >
                    만기 금액 확인하기
                </button>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 rounded-xl p-6 border border-pink-500/30 text-center"
                        >
                            <p className="text-slate-300 text-sm mb-2">세후 만기 수령액</p>
                            <h4 className="text-3xl font-extrabold text-pink-300 mb-4">
                                {result.total.toLocaleString()} 원
                            </h4>

                            <div className="flex justify-between text-xs text-slate-500 border-t border-white/10 pt-3">
                                <span>원금 합계</span>
                                <span>{result.principal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-green-400 mt-1">
                                <span>세후 이자 수익</span>
                                <span>+{result.netInterest.toLocaleString()}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
