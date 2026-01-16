'use client'

interface ContentInputProps {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  rows?: number
}

export function ContentInput({ label, value, onChange, placeholder, rows = 10 }: ContentInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold uppercase tracking-widest text-brand-pink">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-6 bg-brand-black border-4 border-brand-black focus:border-brand-pink outline-none text-neutral-0 font-mono text-sm leading-relaxed resize-none transition-colors"
      />
    </div>
  )
}
