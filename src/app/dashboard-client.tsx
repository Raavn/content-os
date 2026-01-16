'use client'

import { useState } from 'react'
import { Brand } from '@prisma/client'
import { BrandSelector } from '@/components/brand-selector'
import { ContentInput } from '@/components/content-input'
import { GenerationOutput } from '@/components/generation-output'
import { Loader2, Plus, Share2 } from 'lucide-react'

interface DashboardClientProps {
  initialBrands: Brand[]
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
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: selectedBrandId, type: 'BLOG', brief }),
      })
      const data = await res.json()
      if (data.output) {
        setBlogOutput(data.output)
      }
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
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: selectedBrandId, type: 'THREAD', blogContent: blogOutput }),
      })
      const data = await res.json()
      if (data.output) {
        setSocialOutput(data.output)
      }
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
          <button
            onClick={handleGenerateBlog}
            disabled={isGenerating || !brief}
            className="flex items-center gap-2 bg-brand-pink text-brand-black px-8 py-4 font-black uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            {isGenerating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Plus />
            )}
            {isGenerating ? 'Generating...' : 'Generate Blog'}
          </button>
        </div>
      </div>

      {blogOutput && (
        <div className="flex flex-col gap-12">
          <GenerationOutput label="Generated Blog" content={blogOutput} />
          
          <div className="flex justify-end">
            <button
              onClick={handleGenerateSocial}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-neutral-0 text-brand-black px-8 py-4 font-black uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Share2 />
              )}
              {isGenerating ? 'Generating...' : 'Generate Social Posts'}
            </button>
          </div>
        </div>
      )}

      {socialOutput && (
        <GenerationOutput label="Generated Social Posts" content={socialOutput} />
      )}
    </div>
  )
}
