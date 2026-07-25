import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '@/app/auth/actions'
import { ShieldCheck, LogOut, Sparkles, User, ShieldAlert, CheckCircle2, TrendingUp, RefreshCw, MessageSquare, Terminal, Bot, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import PromptForm from './prompt-form'
import LeadTable from './lead-table'

// Force dynamic rendering so Next.js never attempts static prerendering without cookies at build time
export const dynamic = 'force-dynamic'

interface AIInteraction {
  id: string
  user_id: string
  prompt_text: string
  gemini_response: string
  created_at: string
}

export default async function DashboardPage() {
  let user = null
  let authErrorMsg = null

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      authErrorMsg = error.message
    } else {
      user = data?.user
    }
  } catch (err: any) {
    // Rethrow Next.js internal control-flow exceptions
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.digest?.startsWith('NEXT_') || err?.message?.includes('DYNAMIC_SERVER_USAGE') || err?.message?.includes('NEXT_REDIRECT')) {
      throw err
    }
    console.error('Unhandled exception calling getUser() in dashboard:', err)
    authErrorMsg = err.message || 'Failed to authenticate user session on server.'
  }

  // Redirect must be called outside try/catch blocks in Next.js App Router
  if (!user) {
    redirect('/login')
  }

  // Fetch logged-in user's past interactions from Supabase
  let interactions: AIInteraction[] = []
  let fetchErrorMsg: string | null = null

  try {
    const supabase = await createClient()
    const { data, error: dbError } = await supabase
      .from('ai_interactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      fetchErrorMsg = dbError.message
    } else if (data) {
      interactions = data as AIInteraction[]
    }
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.digest?.startsWith('NEXT_') || err?.message?.includes('DYNAMIC_SERVER_USAGE') || err?.message?.includes('NEXT_REDIRECT')) {
      throw err
    }
    console.error('Unhandled exception fetching ai_interactions:', err)
    fetchErrorMsg = err.message || 'An unexpected error occurred while fetching database records.'
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Ambient background lighting */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide">
              SpamLead<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Fixer</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full uppercase tracking-wider">
              Gemini AI Active
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono">{user.email}</span>
            </div>

            <form action={signout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 border border-slate-700 text-xs font-medium text-slate-300 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 z-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Lead Cleansing & Prompt Suite
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Test prompts with Google Gemini, review historical AI interactions, and manage live CRM data.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Model: gemini-2.5-flash</span>
            </div>
          </div>
        </div>

        {/* Hero Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Scanned</span>
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">1,429</div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+18% from last week</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Spam Detected</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-rose-400">312</div>
            <div className="text-[11px] text-slate-400 mt-2">
              <span>21.8% spam detection rate</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Clean Leads</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">1,117</div>
            <div className="text-[11px] text-slate-400 mt-2">
              <span>Ready for CRM export</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Logged Prompts</span>
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              {interactions.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              <span>Stored in ai_interactions</span>
            </div>
          </div>
        </div>

        {/* Client-Side Prompt Submission Form */}
        <PromptForm />

        {/* AI Interaction History Section (Fetched from Supabase) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-lg text-white">Your AI Interaction History</h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {interactions.length} {interactions.length === 1 ? 'record' : 'records'} found in Supabase
            </span>
          </div>

          {fetchErrorMsg && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
              <div>
                <strong>Notice:</strong> Unable to load database interactions ({fetchErrorMsg}). Verify that your Supabase table and environment variables are configured in Vercel.
              </div>
            </div>
          )}

          {interactions.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-300">No AI interactions recorded yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Type a prompt in the box above and click Submit. Your prompt and Google Gemini&apos;s analysis will be saved to your database and appear here automatically!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interactions.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-xl border border-slate-800/80 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
                >
                  <div className="space-y-2">
                    {/* Prompt Header & Date */}
                    <div className="flex items-start justify-between gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        Prompt
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 font-sans leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                      &quot;{item.prompt_text}&quot;
                    </p>
                  </div>

                  {/* Gemini Response */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini 2.5 Flash Response</span>
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-lg border border-slate-900 leading-relaxed whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">
                      {item.gemini_response}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Lead Management Workspace */}
        <div className="pt-6">
          <LeadTable />
        </div>
      </main>
    </div>
  )
}
