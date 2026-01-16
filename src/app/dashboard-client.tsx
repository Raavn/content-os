'use client'

import { useState } from 'react'
import { Brand } from '@prisma/client'
import { BrandSelector } from '@/components/brand-selector'
import { ContentInput } from '@/components/content-input'
import { GenerationOutput } from '@/components/generation-output'
import { ActionButton } from '@/components/action-button'
import { Plus, Share2 } from 'lucide-react'
import Link from 'next/link'

interface DashboardClientProps {
  initialBrands: Brand[]
  initialSelectedBrandId?: string
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

export function DashboardClient({ initialBrands, initialSelectedBrandId }: DashboardClientProps) {
  const [selectedBrandId, setSelectedBrandId] = useState(
    initialSelectedBrandId || initialBrands[0]?.id || ''
  )
  const [brief, setBrief] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [blogOutput, setBlogOutput] = useState('')
  const [socialOutput, setSocialOutput] = useState('')

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
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-0">
          Brands
        </h2>
        <Link
          href="/brands/new"
          className="inline-flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest border-4 border-brand-black bg-neutral-0 text-brand-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Brand
        </Link>
      </div>

      {initialBrands.length > 0 ? (
        <BrandSelector
          brands={initialBrands}
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
