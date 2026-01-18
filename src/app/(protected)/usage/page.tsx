'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UsageByType {
  type: string
  inputTokens: number
  outputTokens: number
  calls: number
}

interface UsageByModel {
  model: string
  inputTokens: number
  outputTokens: number
  calls: number
  cost: number
}

interface UsageData {
  totalInputTokens: number
  totalOutputTokens: number
  totalCalls: number
  totalGenerations: number
  totalCost: number
  pricingConfigured: boolean
  byType: UsageByType[]
  byModel: UsageByModel[]
}

export default function UsagePage() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/usage')
        if (!response.ok) throw new Error('Failed to load usage')
        const data = (await response.json()) as UsageData
        setUsage(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load usage')
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [])

  if (loading) {
    return (
      <main className="p-8 max-w-5xl mx-auto">
        <p className="text-neutral-1 font-semibold">Loading usage...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-8 max-w-5xl mx-auto">
        <p className="text-red-300 font-semibold">{error}</p>
      </main>
    )
  }

  if (!usage) {
    return (
      <main className="p-8 max-w-5xl mx-auto">
        <p className="text-neutral-1 font-semibold">No usage data available.</p>
      </main>
    )
  }

  const totalTokens = usage.totalInputTokens + usage.totalOutputTokens

  return (
    <main className="p-8 max-w-5xl mx-auto flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <Link
          href="/"
          className="text-sm uppercase tracking-[0.3em] font-black text-neutral-1"
        >
          ← Back to Dashboard
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-brand-pink">
              LLM Cost Tracking
            </h1>
            <p className="text-neutral-1 font-semibold">
              Token spend and estimated cost across generations.
            </p>
          </div>
          {!usage.pricingConfigured && (
            <div className="border-2 border-brand-black bg-neutral-0 text-brand-black px-4 py-2 font-black uppercase tracking-widest text-xs">
              Pricing not configured
            </div>
          )}
        </div>
      </header>

      <section className="card-base">
        <div className="flex flex-wrap gap-8 items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-1">Total Tokens</p>
            <p className="text-4xl font-black text-neutral-0">
              {totalTokens.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-1">Estimated Cost</p>
            <p className="text-4xl font-black text-neutral-0">
              ${usage.totalCost.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-1">Input Tokens</p>
            <p className="text-2xl font-bold text-neutral-0">
              {usage.totalInputTokens.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-1">Output Tokens</p>
            <p className="text-2xl font-bold text-neutral-0">
              {usage.totalOutputTokens.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-neutral-1 font-semibold">
          <span>{usage.totalCalls.toLocaleString()} total calls</span>
          <span>{usage.totalGenerations.toLocaleString()} generations</span>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card-base">
          <h2 className="text-xl font-black uppercase tracking-tight text-neutral-0">
            Usage by Type
          </h2>
          {usage.byType.length === 0 ? (
            <p className="text-neutral-1 font-semibold">No usage yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {usage.byType.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between border-2 border-brand-black bg-neutral-3 px-4 py-3 font-semibold"
                >
                  <span className="uppercase tracking-widest text-xs text-neutral-1">
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-neutral-0">
                    {(item.inputTokens + item.outputTokens).toLocaleString()} tokens · {item.calls} calls
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-base">
          <h2 className="text-xl font-black uppercase tracking-tight text-neutral-0">
            Usage by Model
          </h2>
          {usage.byModel.length === 0 ? (
            <p className="text-neutral-1 font-semibold">No usage yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {usage.byModel.map((item) => (
                <div
                  key={item.model}
                  className="flex flex-col gap-2 border-2 border-brand-black bg-neutral-3 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-mono text-neutral-0">{item.model}</span>
                    <span className="text-sm font-semibold text-neutral-1">
                      ${(item.cost || 0).toFixed(4)}
                    </span>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-neutral-1">
                    {(item.inputTokens + item.outputTokens).toLocaleString()} tokens · {item.calls} calls
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
