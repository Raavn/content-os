'use client'

import { Brand } from '@prisma/client'
import { FieldLabel } from '@/components/field-label'

interface BrandSelectorProps {
  brands: Brand[]
  selectedBrandId: string
  onSelect: (id: string) => void
}

export function BrandSelector({ brands, selectedBrandId, onSelect }: BrandSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Select Brand</FieldLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => onSelect(brand.id)}
            className={`p-4 text-left border-4 transition-all ${
              selectedBrandId === brand.id
                ? 'border-brand-pink bg-brand-main-light shadow-[4px_4px_0px_0px_rgba(255,94,108,1)]'
                : 'border-brand-black bg-card hover:border-neutral-2'
            }`}
          >
            <div className="font-black text-xl">{brand.name}</div>
            <div className="text-sm text-neutral-1 mt-1 truncate">
              {brand.systemPrompt}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
