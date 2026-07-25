'use client'

import { useState, useTransition } from 'react'
import { generateAIResponse } from '@/app/dashboard/actions'
import { Bot, Sparkles, Send, CheckCircle2, MessageSquare, Terminal, Loader2, AlertCircle } from 'lucide-react'

const SAMPLE_LEADS_TO_TEST = [
  {
    label: 'Crypto Spam Bot',
    text: 'URGENT!! EARN $5000 DAILY FROM HOME WORKING 5 MINUTES!! CLICK HERE: http://bit.ly/spam-link NOW TO CLAIM YOUR REWARD!!!'
  },
  {
    label: 'Genuine B2B Enterprise Lead',
    text: 'We are looking for an enterprise license for 50 seats. Can we schedule a demo this week with your engineering team?'
  },
  {
    label: 'Unsolicited SEO Outreach',
    text: 'We noticed your website is not ranking #1 on Google for keywords! We offer cheap backlink packages starting at $19.99.'
  }
]

export default function AIInspector() {
  const [activeTab, setActiveTab] = useState<'tester' | 'console'>('tester')
  const [customPrompt, setCustomPrompt] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLogged, setIsLogged] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSendPrompt = (textToSend: string) => {
    setResponse(null)
    setError(null)
    setIsLogged(false)

    startTransition(async () => {
      const res = await generateAIResponse(textToSend)
      if (res?.error) {
        setError(res.error)
      } else if (res?.response) {
        setResponse(res.response)
        setIsLogged(true)
      }
    })
  }

  const handleTestLead = (leadText: string) => {
    const prompt = `You are an expert CRM AI Spam Detector. Analyze this lead inquiry and classify it as CLEAN, SUSPICIOUS, or SPAM. Give a concise 2-sentence reasoning and a Spam Confidence Score (0-100%).\n\nLead Inquiry Text: "${leadText}"`
    setCustomPrompt(prompt)
    handleSendPrompt(prompt)
  }

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6 text-slate-950 animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <span>Gemini 2.5 Flash AI Inspector</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] uppercase font-mono tracking-wider font-bold">
                Live API & Supabase Sync
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Test real-time spam detection prompts. All responses are automatically logged to your <code className="text-cyan-300 font-mono">ai_interactions</code> database table.
            </p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => { setActiveTab('tester'); setResponse(null); setError(null) }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === 'tester'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preset Lead Tests</span>
          </button>
          <button
            onClick={() => { setActiveTab('console'); setResponse(null); setError(null) }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === 'console'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Custom Prompt Console</span>
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Input Area */}
        <div className="lg:col-span-6 space-y-4">
          {activeTab === 'tester' ? (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select a Sample Lead Inquiry to Analyze</span>
              </label>
              <div className="space-y-2.5">
                {SAMPLE_LEADS_TO_TEST.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleTestLead(sample.text)}
                    className="glass-card p-4 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-300 mb-1">
                      <span>{sample.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal group-hover:text-cyan-300 transition-colors">
                        Click to test →
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      &quot;{sample.text}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-violet-400" />
                <span>Enter Custom AI Prompt</span>
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={6}
                placeholder="Type any instruction or lead text for Google Gemini 2.5 Flash to evaluate..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 font-mono transition-all"
              />
              <button
                onClick={() => handleSendPrompt(customPrompt)}
                disabled={isPending || !customPrompt.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini is generating & logging to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send to Gemini & Save to Database</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right / Output Area */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl bg-slate-950/80 border border-slate-800/80 p-5 relative overflow-hidden min-h-[260px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Gemini 2.5 Flash Output
                </span>
              </div>
              {isLogged && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold animate-pulse">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Saved to ai_interactions table</span>
                </span>
              )}
            </div>

            {isPending ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-spin">
                  <Loader2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400 font-medium animate-pulse">
                  Analyzing semantic patterns and contacting Google Gemini API...
                </p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs leading-relaxed">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm mb-1">AI Request Failed</div>
                  <p>{error}</p>
                </div>
              </div>
            ) : response ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-2">
                <Bot className="w-10 h-10 text-slate-700" />
                <p className="text-xs max-w-xs">
                  Click any sample lead on the left or enter a custom prompt to test Google Gemini and verify database logging.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Model: gemini-2.5-flash</span>
            <span>Target Table: public.ai_interactions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
