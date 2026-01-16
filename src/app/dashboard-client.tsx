'use client'

import { useState } from 'react'
import { Brand } from '@prisma/client'
import { BrandSelector } from '@/components/brand-selector'
import { ContentInput } from '@/components/content-input'
import { GenerationOutput } from '@/components/generation-output'
import { ActionButton } from '@/components/action-button'
import { FieldLabel } from '@/components/field-label'
import { Plus, Share2 } from 'lucide-react'

interface DashboardClientProps {
  initialBrands: Brand[]
}

type GenerationType = 'BLOG' | 'THREAD'

async function requestGeneration(payload: {
  brandId: string
  type: GenerationType
  brief?: string
  blogContent?: string
}) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error || 'Generation failed')
  }

  return data.output as string
}

export function DashboardClient({ initialBrands }: DashboardClientProps) {
  const [brands, setBrands] = useState(initialBrands)
  const [selectedBrandId, setSelectedBrandId] = useState(initialBrands[0]?.id || '')
  const [brandName, setBrandName] = useState('')
  const [brandPrompt, setBrandPrompt] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [brief, setBrief] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [blogOutput, setBlogOutput] = useState('')
  const [socialOutput, setSocialOutput] = useState('')

  const handleCreateBrand = async () => {
    if (!brandName.trim() || !brandPrompt.trim()) return

    setIsCreating(true)
    setCreateError('')

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

      const newBrand = data.brand as Brand

      setBrands((prev) =>
        [...prev, newBrand].sort((a, b) => a.name.localeCompare(b.name))
      )
      setSelectedBrandId(newBrand.id)
      setBrandName('')
      setBrandPrompt('')
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Brand creation failed')
    } finally {
      setIsCreating(false)
    }
  }

  const handleGenerateBlog = async () => {
    if (!selectedBrandId || !brief) return

    setIsGenerating(true)
    setBlogOutput('')
    setSocialOutput('')

    try {
      const output = await requestGeneration({ brandId: selectedBrandId, type: 'BLOG', brief })
      setBlogOutput(output)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateSocial = async () => {
    if (!selectedBrandId || !blogOutput) return

    setIsGenerating(true)

    try {
      const output = await requestGeneration({
        brandId: selectedBrandId,
        type: 'THREAD',
        blogContent: blogOutput,
      })
      setSocialOutput(output)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-12">
      <section className="card-base">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-0">
            Create Brand
          </h2>
          <p className="text-sm text-neutral-1">
            Define a brand name and system prompt to steer all generated output.
          </p>
        </div>

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

        {createError && (
          <div className="text-sm font-semibold text-[color:var(--semantic-error)]">
            {createError}
          </div>
        )}

        <div className="flex justify-end">
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

      {brands.length > 0 ? (
        <BrandSelector
          brands={brands}
          selectedBrandId={selectedBrandId}
          onSelect={setSelectedBrandId}
        />
      ) : (
        <div className="border-4 border-brand-black bg-card p-6 text-neutral-1 font-semibold">
          No brands yet. Create your first brand to start generating content.
        </div>
      )}

      <div className="flex flex-col gap-6">
        <ContentInput
          label="Content Brief"
          value={brief}
          onChange={setBrief}
          placeholder="Paste your markdown skeleton here..."
        />

        <div className="flex justify-end">
          <ActionButton
            onClick={handleGenerateBlog}
            disabled={isGenerating || !brief || !selectedBrandId}
            isLoading={isGenerating}
            icon={<Plus />}
            idleText="Generate Blog"
            loadingText="Generating..."
            className="bg-brand-pink text-brand-black"
          />
        </div>
      </div>

      {blogOutput && (
        <div className="flex flex-col gap-12">
          <GenerationOutput label="Generated Blog" content={blogOutput} />
          
          <div className="flex justify-end">
            <ActionButton
              onClick={handleGenerateSocial}
              disabled={isGenerating}
              isLoading={isGenerating}
              icon={<Share2 />}
              idleText="Generate Social Posts"
              loadingText="Generating..."
              className="bg-neutral-0 text-brand-black"
            />
          </div>
        </div>
      )}

      {socialOutput && (
        <GenerationOutput label="Generated Social Posts" content={socialOutput} />
      )}
    </div>
  )
}
