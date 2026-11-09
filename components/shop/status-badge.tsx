import { statusLabel } from '@/lib/format'
import { cn } from '@/lib/utils'

const tone: Record<string, string> = {
  pending: 'border-amber-500/50 text-amber-400',
  paid: 'border-emerald-500/50 text-emerald-400',
  processing: 'border-sky-500/50 text-sky-400',
  shipped: 'border-violet-500/50 text-violet-400',
  completed: 'border-primary text-primary',
  cancelled: 'border-destructive/60 text-destructive',
  expired: 'border-border text-muted-foreground',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block border px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em]',
        tone[status] ?? 'border-border text-muted-foreground',
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  )
}
