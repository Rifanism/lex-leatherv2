import Image from 'next/image'
import { Logo } from '@/components/site/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/images/hero.png"
          alt="Tas kulit Lex Leather dalam pencahayaan hangat"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/10" />
        <div className="absolute inset-x-12 bottom-14 space-y-4">
          <p className="eyebrow">Lex Leather Atelier</p>
          <p className="font-serif text-4xl leading-tight text-balance">
            Kulit asli untuk setiap langkah perjalanan akademik Anda.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="mb-10">
          <Logo />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
