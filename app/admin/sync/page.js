"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { RefreshCw, Database, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function SyncAdminPage() {
    const [syncStatus, setSyncStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);
    const [secretKey, setSecretKey] = useState("");

    // 동기화 상태 가져오기
    const fetchSyncStatus = async () => {
        try {
            const response = await fetch('/api/sync-subsidies');
            const data = await response.json();
            if (data.success) {
                setSyncStatus(data.data);
            }
        } catch (error) {
            console.error('상태 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSyncStatus();
    }, []);

    // 동기화 실행
    const handleSync = async () => {
        if (!secretKey) {
            alert('동기화 키를 입력해주세요.');
            return;
        }

        setSyncing(true);
        setSyncResult(null);

        try {
            const response = await fetch('/api/sync-subsidies', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${secretKey}`,
                },
            });
            
            const data = await response.json();
            setSyncResult(data);
            
            if (data.success) {
                fetchSyncStatus(); // 상태 갱신
            }
        } catch (error) {
            setSyncResult({ success: false, error: error.message });
        } finally {
            setSyncing(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <main className="min-h-screen bg-[#0f172a] pb-20">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🔄 데이터 동기화 관리</h1>
                    <p className="text-gray-400">공공데이터 API에서 지원금 정보를 동기화합니다.</p>
                </div>

                {/* 현재 상태 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                <Database className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-slate-400">유효한 지원금</span>
                        </div>
                        <p className="text-3xl font-bold text-emerald-400">
                            {loading ? '...' : (syncStatus?.activeSubsidies || 0).toLocaleString()}개
                        </p>
                        <p className="text-xs text-slate-500 mt-1">신청 가능한 지원금</p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-500/15 flex items-center justify-center">
                                <Database className="w-5 h-5 text-slate-400" />
                            </div>
                            <span className="text-slate-400">전체 저장된</span>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {loading ? '...' : (syncStatus?.totalSubsidies || 0).toLocaleString()}개
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {syncStatus?.expiredCount > 0 && `(만료: ${syncStatus.expiredCount}개)`}
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-slate-400">마지막 동기화</span>
                        </div>
                        <p className="text-lg font-medium text-white">
                            {loading ? '...' : formatDate(syncStatus?.lastSync?.syncedAt)}
                        </p>
                        {syncStatus?.lastSync && (
                            <p className={`text-sm mt-1 ${
                                syncStatus.lastSync.status === 'success' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                                {syncStatus.lastSync.status === 'success' ? '✓ 성공' : '✗ 실패'} 
                            </p>
                        )}
                    </div>
                </div>

                {/* 동기화 실행 */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">동기화 실행</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">동기화 키</label>
                            <input
                                type="password"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                placeholder="SYNC_SECRET_KEY 값을 입력하세요"
                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                * .env 파일의 SYNC_SECRET_KEY 값 (기본값: sync-secret-123)
                            </p>
                        </div>

                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                            {syncing ? '동기화 중... (최대 1분 소요)' : '지금 동기화 실행'}
                        </button>
                    </div>

                    {/* 동기화 결과 */}
                    {syncResult && (
                        <div className={`mt-4 p-4 rounded-lg ${
                            syncResult.success 
                                ? 'bg-emerald-500/10 border border-emerald-500/20' 
                                : 'bg-red-500/10 border border-red-500/20'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                {syncResult.success ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-400" />
                                )}
                                <span className={syncResult.success ? 'text-emerald-400' : 'text-red-400'}>
                                    {syncResult.success ? '동기화 성공!' : '동기화 실패'}
                                </span>
                            </div>
                            
                            {syncResult.success && syncResult.stats && (
                                <div className="grid grid-cols-5 gap-3 mt-3 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{syncResult.stats.total}</p>
                                        <p className="text-xs text-slate-400">유효 데이터</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-400">{syncResult.stats.new}</p>
                                        <p className="text-xs text-slate-400">신규 추가</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-400">{syncResult.stats.updated}</p>
                                        <p className="text-xs text-slate-400">업데이트</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-amber-400">{syncResult.stats.skipped || 0}</p>
                                        <p className="text-xs text-slate-400">만료 제외</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-400">{syncResult.stats.deleted || 0}</p>
                                        <p className="text-xs text-slate-400">삭제됨</p>
                                    </div>
                                </div>
                            )}
                            
                            {syncResult.error && (
                                <p className="text-red-400 text-sm mt-2">{syncResult.error}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* 안내 */}
                <div className="bg-slate-800/30 p-6 rounded-xl border border-white/5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                        <div>
                            <h3 className="text-white font-medium mb-2">동기화 안내</h3>
                            <ul className="text-sm text-slate-400 space-y-1">
                                <li>• 공공데이터 API에서 최대 1,000개의 지원금 정보를 가져옵니다.</li>
                                <li>• 동기화는 하루 1회 정도 실행하시면 됩니다.</li>
                                <li>• 동기화 중에는 페이지를 닫지 마세요.</li>
                                <li>• 프로덕션에서는 자동화(Cron Job)를 권장합니다.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

