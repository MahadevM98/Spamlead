'use client'

import { useState } from 'react'
import { Sparkles, Search, Filter, ShieldAlert, CheckCircle2, AlertTriangle, Trash2, Check, RefreshCw, Bot } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  company: string
  message: string
  status: 'clean' | 'spam' | 'suspicious'
  spamScore: number
  aiReason?: string
}

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Sarah Jenkins',
    email: 's.jenkins@acmecorp.io',
    company: 'Acme Corp',
    message: 'We are looking for an enterprise license for 50 seats. Can we schedule a demo this week?',
    status: 'clean',
    spamScore: 4,
    aiReason: 'Professional corporate domain and clear, actionable B2B purchasing intent.'
  },
  {
    id: 'lead-102',
    name: 'CryptoKing99',
    email: 'buybtcnow_winner@telegram-bots.ru',
    company: '1000X Crypto Signals',
    message: 'URGENT!! EARN $5000 DAILY FROM HOME WORKING 5 MINUTES!! CLICK HERE: http://bit.ly/spam-link NOW TO CLAIM YOUR REWARD!!!',
    status: 'spam',
    spamScore: 99,
    aiReason: 'High concentration of spam keywords ("EARN DAILY", "URGENT"), excessive punctuation, and untrusted domain.'
  },
  {
    id: 'lead-103',
    name: 'Michael Chang',
    email: 'mchang@dataflow.tech',
    company: 'DataFlow Systems',
    message: 'Hi team, checking if your API supports custom webhook payloads for real-time lead sync into Salesforce?',
    status: 'clean',
    spamScore: 8,
    aiReason: 'Specific technical inquiry referencing standard CRM integrations.'
  },
  {
    id: 'lead-104',
    name: 'BestSEO Ranker',
    email: 'info@top-google-ranking-2026.xyz',
    company: 'SEO Boosters',
    message: 'We noticed your website is not ranking #1 on Google for keywords! We offer cheap backlink packages starting at $19.99.',
    status: 'spam',
    spamScore: 94,
    aiReason: 'Unsolicited SEO agency outreach with generic sales template and low-reputation top-level domain.'
  },
  {
    id: 'lead-105',
    name: 'David Rossi',
    email: 'drossi@freemail-temp.net',
    company: 'Self Employed',
    message: 'hello need discount code plz',
    status: 'suspicious',
    spamScore: 68,
    aiReason: 'Disposable email provider detected with vague, low-effort submission text.'
  }
]

export default function LeadTable() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'clean' | 'spam' | 'suspicious'>('all')
  const [isCleansing, setIsCleansing] = useState(false)
  const [cleanseProgress, setCleanseProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleRunAICleanse = () => {
    setIsCleansing(true)
    setCleanseProgress(10)
    setStatusMessage('Connecting to Google Gemini AI service...')

    setTimeout(() => {
      setCleanseProgress(45)
      setStatusMessage('Scanning lead text for semantic anomalies & bot patterns...')
    }, 800)

    setTimeout(() => {
      setCleanseProgress(80)
      setStatusMessage('Purging high-confidence spam submissions from database...')
    }, 1800)

    setTimeout(() => {
      setCleanseProgress(100)
      setLeads((prev) => prev.filter((lead) => lead.status !== 'spam'))
      setIsCleansing(false)
      setStatusMessage('Gemini AI Cleanse complete! Removed 2 confirmed spam leads.')
      setTimeout(() => setStatusMessage(null), 5000)
    }, 2600)
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || lead.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Table Header / Action Toolbar */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-violet-500 rounded-full" />
          <h2 className="font-bold text-lg text-white">Live Lead Queue</h2>
          <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full font-mono">
            {filteredLeads.length} items
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter tabs */}
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-medium">
            {(['all', 'clean', 'suspicious', 'spam'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                  filter === tab
                    ? 'bg-slate-800 text-cyan-400 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* AI Cleanse Action Button */}
          <button
            onClick={handleRunAICleanse}
            disabled={isCleansing || leads.every((l) => l.status !== 'spam')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-teal-500 to-violet-600 hover:opacity-90 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Bot className={`w-4 h-4 text-slate-950 ${isCleansing ? 'animate-bounce' : ''}`} />
            <span>{isCleansing ? 'AI Cleansing in Progress...' : 'Run Gemini AI Cleanse'}</span>
          </button>
        </div>
      </div>

      {/* Progress / Status Bar during AI cleanse */}
      {(isCleansing || statusMessage) && (
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3 text-xs font-medium text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{statusMessage}</span>
          </div>
          {isCleansing && (
            <div className="w-36 sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 ease-out"
                style={{ width: `${cleanseProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 bg-slate-900/20 border-b border-slate-800/60 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by lead name, email, company, or message content..."
          className="bg-transparent border-none text-sm text-slate-200 placeholder-slate-500 focus:outline-none w-full font-sans"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-6">Lead & Contact</th>
              <th className="py-3 px-6">Inquiry Message</th>
              <th className="py-3 px-6">Spam Score</th>
              <th className="py-3 px-6">AI Status & Reasoning</th>
              <th className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                  No leads matching your current filters or search query.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors group">
                  {/* Lead details */}
                  <td className="py-4 px-6 align-top">
                    <div className="font-bold text-white">{lead.name}</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{lead.email}</div>
                    <div className="text-xs font-semibold text-cyan-400/80 mt-1">{lead.company}</div>
                  </td>

                  {/* Message */}
                  <td className="py-4 px-6 align-top max-w-md">
                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                      {lead.message}
                    </p>
                  </td>

                  {/* Spam Score Badge */}
                  <td className="py-4 px-6 align-top">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            lead.spamScore >= 80
                              ? 'bg-rose-500'
                              : lead.spamScore >= 40
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${lead.spamScore}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold font-mono ${
                          lead.spamScore >= 80
                            ? 'text-rose-400'
                            : lead.spamScore >= 40
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {lead.spamScore}%
                      </span>
                    </div>
                  </td>

                  {/* AI Status badge & reason */}
                  <td className="py-4 px-6 align-top max-w-xs">
                    <div className="flex items-center gap-1.5 mb-1">
                      {lead.status === 'clean' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Clean
                        </span>
                      )}
                      {lead.status === 'spam' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase animate-pulse">
                          <ShieldAlert className="w-3 h-3" /> Spam Detected
                        </span>
                      )}
                      {lead.status === 'suspicious' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">
                          <AlertTriangle className="w-3 h-3" /> Suspicious
                        </span>
                      )}
                    </div>
                    {lead.aiReason && (
                      <p className="text-[11px] text-slate-400 italic mt-1 leading-snug">
                        "{lead.aiReason}"
                      </p>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-4 px-6 align-top text-right">
                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {lead.status !== 'clean' && (
                        <button
                          onClick={() =>
                            setLeads((prev) =>
                              prev.map((l) => (l.id === lead.id ? { ...l, status: 'clean', spamScore: 5 } : l))
                            )
                          }
                          title="Mark as Verified Clean"
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setLeads((prev) => prev.filter((l) => l.id !== lead.id))}
                        title="Delete Lead"
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
