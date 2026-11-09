import Link from 'next/link'

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex flex-col items-center leading-none">
      <span className="font-serif text-2xl font-semibold tracking-[0.38em] text-foreground transition-colors group-hover:text-primary md:text-[1.7rem]">
        LEX LEATHER
      </span>
      <span className="mt-1 text-[0.55rem] uppercase tracking-[0.5em] text-primary">
        Atelier
      </span>
    </Link>
  )
}
