import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export function ProductImage({ src, alt, className, sizes, priority }: Props) {
  if (src.startsWith('/')) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'}
        className={cn('object-cover', className)}
      />
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin-provided external URLs
    <img
      src={src || '/placeholder.svg'}
      alt={alt}
      className={cn('absolute inset-0 size-full object-cover', className)}
    />
  )
}
