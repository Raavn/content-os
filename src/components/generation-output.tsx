'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { FieldLabel } from '@/components/field-label'

interface GenerationOutputProps {
  label: string
  content: string
}

export function GenerationOutput({ label, content }: GenerationOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!content) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-brand-pink text-brand-black px-4 py-2 hover:bg-highlight transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy Markdown'}
        </button>
      </div>
      <div className="card-base p-8 font-mono text-sm leading-relaxed overflow-auto max-h-[600px] whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
}
