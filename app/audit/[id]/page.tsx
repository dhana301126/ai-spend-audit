'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AuditResult } from '@/types'

export default function AuditPage() {
  const { id } = useParams()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState('')
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    fetch(`/api/audit?id=${id}`)
      .then(r => r.json())
      .then(async (data) => {
        setResult(data)
        setLoading(false)

        // Generate AI summary
        const tools = data.input.tools.map((t: { tool: string }) => t.tool)
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auditId: data.id,
            totalMonthlySavings: data.totalMonthlySavings,
            totalAnnualSavings: data.totalAnnualSavings,
            tools,
            useCase: data.input.useCase,
          }),
        })
        const summaryData = await res.json()
        setSummary(summaryData.summary)
      })
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400 text-xl">Loading your audit...</p>
    </div>
  )

  if (!result) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400 text-xl">Audit not found.</p>
    </div>
  )

  const isHighSavings = result.totalMonthlySavings > 500
  const isLowSavings = result.totalMonthlySavings < 100

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gradient-to-b from-green-900/40 to-gray-950 py-16 px-4 text-center">
        <p className="text-green-400 font-semibold mb-2 uppercase tracking-widest text-sm">Your AI Spend Audit</p>
        {isLowSavings ? (
          <>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">You are Spending Well</h1>
            <p className="text-gray-400 text-lg">Your AI tool spend looks optimized.</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              You could save{' '}
              <span className="text-green-400">${result.totalMonthlySavings}/mo</span>
            </h1>
            <p className="text-gray-400 text-lg">
              That is <span className="text-white font-bold">${result.totalAnnualSavings}/year</span> back in your budget.
            </p>
          </>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20">

        {/* AI Summary */}
        {summary && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-green-500/20">
            <p className="text-green-400 text-sm font-semibold mb-2">AI ANALYSIS</p>
            <p className="text-gray-300 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Tool breakdown */}
        <h2 className="text-xl font-semibold mb-4">Tool Breakdown</h2>
        <div className="space-y-4 mb-10">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-lg capitalize">{rec.tool.replace('-', ' ')}</p>
                  <p className="text-gray-400 text-sm">Current: {rec.currentPlan} — ${rec.currentSpend}/mo</p>
                </div>
                {rec.estimatedSavings > 0 ? (
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ${rec.estimatedSavings}/mo
                  </span>
                ) : (
                  <span className="bg-gray-700 text-gray-400 px-3 py-1 rounded-full text-sm">
                    Optimal
                  </span>
                )}
              </div>
              <p className="text-green-300 font-medium mb-1">{rec.recommendedAction}</p>
              <p className="text-gray-400 text-sm">{rec.reason}</p>
            </div>
          ))}
        </div>

        {/* Credex CTA */}
        {isHighSavings && (
          <div className="bg-green-900/30 border border-green-500/40 rounded-2xl p-6 mb-10">
            <h3 className="text-xl font-bold text-green-400 mb-2">Unlock Even More Savings with Credex</h3>
            <p className="text-gray-300 mb-4">
              Credex sells discounted AI credits at up to 40% off retail.
              With ${result.totalMonthlySavings}/mo in identified savings, a Credex consultation could save you even more.
            </p>
            <button
              onClick={() => window.open('https://credex.rocks', '_blank')}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition"
            >
              Book a Free Credex Consultation
            </button>
          </div>
        )}

        {/* Email capture */}
        {!emailSent ? (
          <div className="bg-gray-900 rounded-2xl p-6 mb-10">
            <h3 className="text-lg font-semibold mb-1">Get This Report in Your Inbox</h3>
            <p className="text-gray-400 text-sm mb-4">We will also notify you when new savings apply to your stack.</p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-green-500 outline-none"
              />
              <button
                onClick={() => setEmailSent(true)}
                className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded-lg transition"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-6 mb-10 text-center">
            <p className="text-green-400 font-semibold">Got it! Check your inbox shortly.</p>
          </div>
        )}

        {/* Share */}
        <div className="bg-gray-900 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Share This Audit</h3>
          <p className="text-gray-400 text-sm mb-4">Send to your co-founder or engineering manager</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              alert('Link copied!')
            }}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition"
          >
            Copy Shareable Link
          </button>
        </div>
      </div>
    </main>
  )
}