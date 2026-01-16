'use client'

import { useState } from 'react'
import { Brand } from '@prisma/client'
import { BrandSelector } from '@/components/brand-selector'
import { ContentInput } from '@/components/content-input'
import { GenerationOutput } from '@/components/generation-output'
import { ActionButton } from '@/components/action-button'
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
  const [selectedBrandId, setSelectedBrandId] = useState(initialBrands[0]?.id || '')
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
      <BrandSelector
        brands={initialBrands}
        selectedBrandId={selectedBrandId}
        onSelect={setSelectedBrandId}
      />

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
            disabled={isGenerating || !brief}
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
