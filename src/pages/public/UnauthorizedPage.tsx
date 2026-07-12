import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background decoration elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-rose-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-lg border border-slate-200/85 rounded-3xl p-8 sm:p-10 text-center shadow-xl animate-fade-in-up">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldAlert className="w-8 h-8 text-rose-600 animate-pulse" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
          403 Forbidden
        </h1>
        
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
          Access Denied
        </p>

        <p className="text-slate-500 leading-relaxed text-sm mb-8">
          You do not have permission to view this resource. Please make sure you are logged into an authorized account or contact an administrator.
        </p>

        <div className="space-y-3">
          <Button
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold rounded-xl active:scale-95 duration-150 shadow-md shadow-emerald-600/10"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Go to Home
          </Button>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sign in with a different account
          </Link>
        </div>
      </div>
    </div>
  );
}
