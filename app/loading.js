import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 bg-[#0f172a] flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-sm font-medium animate-pulse">
                    잠시만 기다려주세요...
                </p>
            </div>
        </div>
    );
}
