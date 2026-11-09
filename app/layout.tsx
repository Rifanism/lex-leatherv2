import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Lex Leather Atelier - Tas & Dompet Kulit Asli untuk Mahasiswa',
    template: '%s | Lex Leather Atelier',
  },
  description:
    'Tas ransel, tote, laptop sleeve, dan dompet kulit asli yang dirancang untuk kebutuhan kuliah: tugas, presentasi, hingga sidang. Pembayaran lewat bank, e-wallet, dan QRIS.',
}

export const viewport: Viewport = {
  themeColor: '#171411',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`dark ${jost.variable} ${cormorant.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            },
          }}
        />
      </body>
    </html>
  )
}
