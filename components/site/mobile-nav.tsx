'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/site/logo'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function MobileNav({
  links,
}: {
  links: { href: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Buka menu"
        className="inline-flex size-10 items-center justify-center text-foreground"
      >
        <Menu className="size-5" strokeWidth={1.4} />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-border bg-background">
        <SheetHeader className="pb-2">
          <SheetTitle className="sr-only">Navigasi Lex Leather Atelier</SheetTitle>
          <Logo onClick={() => setOpen(false)} />
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border py-4 font-serif text-2xl text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
