'use client'

import type { ReactNode } from 'react'

interface FieldLabelProps {
  children: ReactNode
  className?: string
}

export function FieldLabel({ children, className }: FieldLabelProps) {
  const classes = ['text-sm', 'font-bold', 'uppercase', 'tracking-widest', 'text-brand-pink', className]
    .filter(Boolean)
    .join(' ')

  return <label className={classes}>{children}</label>
}
