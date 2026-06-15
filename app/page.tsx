'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuditInput, ToolEntry, ToolName, UseCase } from '@/types'

const TOOLS: { value: ToolName; label: string; plans: string[] }[] = [
  { value: 'cursor', label: 'Cursor', plans: ['Hobby', 'Pro', 'Business', 'Enterprise'] },
  { value: 'github-copilot', label: 'GitHub Copilot', plans: ['Individual', 'Business', 'Enterprise'] },
  { value: 'claude', label: 'Claude', plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API'] },
  { value: 'chatgpt', label: 'ChatGPT', plans: ['Free', 'Plus', 'Team', 'Enterprise', 'API'] },
  { value: 'anthropic-api', label: 'Anthropic API Direct', plans: ['Direct'] },
  { value: 'openai-api', label: 'OpenAI API Direct', plans: ['Direct'] },
  { value: 'gemini', label: 'Gemini', plans: ['Free', 'Pro', 'Ultra', 'API'] },
  { value: 'windsurf', label: 'Windsurf', plans: ['Free', 'Pro', 'Team'] },
]

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: '💻 Coding' },
  { value: 'writing', label: '✍️ Writing' },
  { value: 'data', label: '📊 Data Analysis' },
  { value: 'research', label: '🔍 Research' },
  { value: 'mixed', label: '🔀 Mixed' },
]

const defaultTool = (): ToolEntry => ({
  tool: 'cursor',
  plan: 'Pro',
  seats: 1,
  monthlySpend: 20,
})

export default function Home() {
  const router = useRouter()
  const [tools, setTools] = useState<ToolEntry[]>([defaultTool()])
  const [teamSize, setTeamSize] = useState(1)
  const [useCase, setUseCase] = useState<UseCase>('coding')
  const [loading, setLoading] = useState(false)

  const addTool = () => setTools([...tools, defaultTool()])

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index))
  }

  const updateTool = (index: number, field: keyof ToolEntry, value: string | number) => {
    const updated = [...tools]
    if (field === 'tool') {
      const toolConfig = TOOLS.find(t => t.value === value)
      updated[index] = {
        ...updated[index],
        tool: value as ToolName,
        plan: toolConfig?.plans[0] || 'Pro',
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setTools(updated)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const input: AuditInput = { tools, teamSize, useCase }

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (data.result) {
        sessionStorage.setItem(`audit_${data.id}`, JSON.stringify(data.result))
      }
      router.push(`/audit/${data.id}`)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-green-900/30 to-gray-950 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Stop Overpaying for <span className="text-green-400">AI Tools</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Free audit for startups. See exactly where you're wasting money on AI subscriptions and how much you could save.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        {/* Team info */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Team</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Team Size</label>
              <input
                type="number"
                min={1}
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Primary Use Case</label>
              <select
                value={useCase}
                onChange={e => setUseCase(e.target.value as UseCase)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-green-500 outline-none"
              >
                {USE_CASES.map(uc => (
                  <option key={uc.value} value={uc.value}>{uc.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Your AI Tools</h2>
          {tools.map((entry, index) => {
            const toolConfig = TOOLS.find(t => t.value === entry.tool)
            return (
              <div key={index} className="bg-gray-900 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-300">Tool #{index + 1}</span>
                  {tools.length > 1 && (
                    <button
                      onClick={() => removeTool(index)}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Tool</label>
                    <select
                      value={entry.tool}
                      onChange={e => updateTool(index, 'tool', e.target.value)}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-green-500 outline-none"
                    >
                      {TOOLS.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Plan</label>
                    <select
                      value={entry.plan}
                      onChange={e => updateTool(index, 'plan', e.target.value)}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-green-500 outline-none"
                    >
                      {toolConfig?.plans.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Seats</label>
                    <input
                      type="number"
                      min={1}
                      value={entry.seats}
                      onChange={e => updateTool(index, 'seats', Number(e.target.value))}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Monthly Spend ($)</label>
                    <input
                      type="number"
                      min={0}
                      value={entry.monthlySpend}
                      onChange={e => updateTool(index, 'monthlySpend', Number(e.target.value))}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-green-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={addTool}
          className="w-full border border-dashed border-gray-600 rounded-2xl py-4 text-gray-400 hover:border-green-500 hover:text-green-400 transition mb-6"
        >
          + Add Another Tool
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl text-lg transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : '🔍 Run My Free Audit'}
        </button>
      </div>
    </main>
  )
}