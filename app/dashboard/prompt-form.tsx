'use client'

import { useState, useTransition } from 'react'
import { generateAIResponse } from '@/app/dashboard/actions'
import { Bot, Send, Sparkles, Loader2, AlertCircle, Terminal } from 'lucide-react'

export default function PromptForm() {
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isPending) return

    setError(null)
    const currentPrompt = prompt

    startTransition(async () => {
      const res = await generateAIResponse(currentPrompt)
      if (res?.error) {
        setError(res.error)
      } else {
        // On success, revalidatePath on server automatically refreshes the history grid below
        setPrompt('')
      }
    })
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 via-teal-400 to-violet-500 flex items-center justify-center text-slate-950 shadow-md">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <span>Gemini AI Prompt Suite</span>
            </h2>
            <p className="text-xs text-slate-400">
              Enter lead data, questions, or spam classification instructions. Responses are saved below in real-time.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>gemini-2.5-flash</span>
        </span>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-xs animate-pulse">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            disabled={isPending}
            placeholder="e.g., Analyze this message for spam: 'URGENT!! EARN $5000 DAILY FROM HOME WORKING 5 MINUTES!! CLICK HERE NOW...'"
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>Auto-logs to public.ai_interactions</span>
          </div>

          <button
            type="submit"
            disabled={isPending || !prompt.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-violet-500 hover:opacity-95 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Generating AI Response...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                <span>Submit to Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
