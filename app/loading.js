import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin mx-auto mb-4" />
                </div>
                <p className="text-slate-400 text-sm font-medium animate-pulse">
                    잠시만 기다려주세요...
                </p>
            </div>
        </div>
    );
}
