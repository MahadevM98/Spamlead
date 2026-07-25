import Link from 'next/link'
import { ShieldCheck, Sparkles, Zap, Lock, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-violet-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            SpamLead<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400">Fixer</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-violet-500 hover:opacity-90 text-slate-950 px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-16 pb-24 text-center flex flex-col items-center justify-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-cyan-300 mb-8 animate-float">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next Generation CRM Protection powered by Google Gemini 3.1 Pro</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Purge Malicious Bots and <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400">Spam Leads</span> Instantly
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Stop wasting sales team hours on junk submissions. Our AI engine scans form payloads in real-time, scores anomaly confidence, and keeps your CRM spotless.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-violet-500 hover:opacity-95 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base transition-all flex items-center justify-center"
          >
            View Live Dashboard
          </Link>
        </div>

        {/* Value Prop Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Gemini AI Detection</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Deep semantic analysis evaluates submission context, grammar anomalies, and bot phrasing with 99.4% accuracy.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Supabase Realtime Auth</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Built on enterprise-grade Supabase session security, SSR cookies, and Row Level Security data isolation.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">One-Click AI Purge</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Execute batch cleansing workflows with instant visual feedback and automated CRM data sanitation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-500">
        <p>© 2026 SpamLeadFixer. Built with Next.js 16, Supabase SSR, and Google Gemini.</p>
      </footer>
    </div>
  )
}
