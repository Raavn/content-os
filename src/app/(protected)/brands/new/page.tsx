'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ContentInput } from '@/components/content-input'
import { FieldLabel } from '@/components/field-label'
import { ActionButton } from '@/components/action-button'
import { Plus } from 'lucide-react'

export default function NewBrandPage() {
  const router = useRouter()
  const [brandName, setBrandName] = useState('')
  const [brandPrompt, setBrandPrompt] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleCreateBrand = async () => {
    if (!brandName.trim() || !brandPrompt.trim()) return

    setIsCreating(true)
    setError('')

    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brandName.trim(),
          systemPrompt: brandPrompt.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Brand creation failed')
      }

      router.push(`/?brandId=${data.brand.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Brand creation failed')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main className="p-8 max-w-5xl mx-auto flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-brand-pink">
          New Brand
        </h1>
        <p className="text-neutral-1 font-semibold">
          Define a brand name and system prompt to guide all generated content.
        </p>
      </header>

      <section className="card-base">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <FieldLabel>Brand Name</FieldLabel>
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Orbit Labs"
              className="w-full p-4 bg-brand-black border-4 border-brand-black focus:border-brand-pink outline-none text-neutral-0 font-mono text-sm transition-colors"
            />
          </div>

          <ContentInput
            label="System Prompt"
            value={brandPrompt}
            onChange={setBrandPrompt}
            placeholder="Voice, tone, audience, and constraints..."
            rows={6}
          />
        </div>

        {error && (
          <div className="text-sm font-semibold text-[color:var(--semantic-error)]">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-4">
          <Link
            href="/"
            className="px-6 py-3 font-black uppercase tracking-widest border-4 border-brand-black bg-transparent text-neutral-0"
          >
            Cancel
          </Link>
          <ActionButton
            onClick={handleCreateBrand}
            disabled={isCreating || !brandName.trim() || !brandPrompt.trim()}
            isLoading={isCreating}
            icon={<Plus />}
            idleText="Create Brand"
            loadingText="Creating..."
            className="bg-neutral-0 text-brand-black"
          />
        </div>
      </section>
    </main>
  )
}
