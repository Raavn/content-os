'use client'

import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ActionButtonProps {
  onClick: () => void | Promise<void>
  disabled?: boolean
  isLoading?: boolean
  icon?: ReactNode
  idleText: string
  loadingText?: string
  className?: string
}

export function ActionButton({
  onClick,
  disabled,
  isLoading,
  icon,
  idleText,
  loadingText = 'Loading...',
  className,
}: ActionButtonProps) {
  const classes = [
    'flex',
    'items-center',
    'gap-2',
    'px-8',
    'py-4',
    'font-black',
    'uppercase',
    'tracking-widest',
    'cursor-pointer',
    'hover:scale-105',
    'active:scale-95',
    'disabled:opacity-50',
    'disabled:scale-100',
    'transition-all',
    'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {isLoading ? <Loader2 className="animate-spin" /> : icon}
      {isLoading ? loadingText : idleText}
    </button>
  )
}
