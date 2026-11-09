'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function CopyButton({
  text,
  label = 'Salin',
  className = '',
}: {
  text: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(`${label} berhasil disalin`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin teks')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary',
        copied && 'border-primary text-primary',
        className,
      )}
      title={`Salin ${text}`}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span>{copied ? 'Tersalin' : label}</span>
    </button>
  )
}
