'use client'

import { useState } from 'react'
import {
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { CopyButton } from '@/components/shop/copy-button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const DUMMY_PHONE_DISPLAY = '+62 812-3456-7890'
const DUMMY_PHONE_NUMBER = '6281234567890'

const QUICK_TOPICS = [
  {
    title: 'Konsultasi Produk & Ukuran',
    desc: 'Tanya muatan tas laptop, jenis kulit, atau ketersediaan warna.',
    text: 'Halo Lex Leather Atelier, saya ingin konsultasi mengenai spesifikasi produk dan ukuran tas...',
  },
  {
    title: 'Konfirmasi Pembayaran',
    desc: 'Kirimkan kode pesanan dan bukti transfer bank.',
    text: 'Halo Lex Leather Atelier, saya ingin konfirmasi pembayaran untuk pesanan saya...',
  },
  {
    title: 'Garansi 1 Tahun & Perawatan',
    desc: 'Informasi klaim garansi jahitan atau cara merawat kulit.',
    text: 'Halo Lex Leather Atelier, saya ingin bertanya tentang ketentuan garansi 1 tahun dan perawatan kulit...',
  },
]

export function WhatsAppConcierge() {
  const [open, setOpen] = useState(false)

  function openWhatsApp(customText?: string) {
    const message = customText || 'Halo Lex Leather Atelier, saya ingin bertanya tentang koleksi produk Anda...'
    const url = `https://wa.me/${DUMMY_PHONE_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Floating Concierge Button */}
      <aside
        aria-label="Layanan Concierge WhatsApp"
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 border border-primary/40 bg-background/90 px-4 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-background hover:shadow-primary/10 active:scale-95"
          aria-label="Buka Concierge WhatsApp"
        >
          <div className="relative flex size-3 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </div>

          <MessageCircle className="size-5 text-primary transition-transform duration-300 group-hover:scale-110" />

          <div className="hidden flex-col text-left sm:flex">
            <span className="font-serif text-xs font-semibold tracking-wider text-foreground">
              Artisan Concierge
            </span>
            <span className="text-[0.62rem] uppercase tracking-widest text-muted-foreground">
              WhatsApp Online
            </span>
          </div>
        </button>
      </aside>

      {/* Concierge Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-none border-border bg-background p-6">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
              <Sparkles className="size-3.5" />
              <span>Lex Leather Concierge</span>
            </div>
            <DialogTitle className="font-serif text-3xl font-normal">
              Bantuan &amp; Konsultasi
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
              Layanan personal dari pengrajin Lex Leather Atelier untuk menjawab
              kebutuhan tas, dompet, dan perawatan kulit asli Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* CS Contact Info */}
            <div className="flex items-center justify-between border border-border bg-card/50 p-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Nomor CS Atelier (Simulasi)
                </p>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {DUMMY_PHONE_DISPLAY}
                </p>
              </div>
              <CopyButton text={DUMMY_PHONE_DISPLAY} label="Salin Nomor" />
            </div>

            {/* Quick Topic Buttons */}
            <div className="space-y-2">
              <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Pilih Topik Konsultasi Cepat:
              </p>
              <div className="grid gap-2">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic.title}
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      openWhatsApp(topic.text)
                    }}
                    className="group flex flex-col items-start border border-border p-3 text-left transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-1.5 font-serif text-sm text-foreground transition-colors group-hover:text-primary">
                      {topic.title}
                      <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 text-xs text-muted-foreground">
                      {topic.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Open Button */}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                openWhatsApp()
              }}
              className="flex h-12 w-full items-center justify-center gap-2 border border-primary bg-primary text-xs uppercase tracking-[0.25em] text-primary-foreground transition-all hover:bg-primary/90"
            >
              <MessageCircle className="size-4" />
              <span>Buka Obrolan WhatsApp</span>
            </button>

            <div className="flex items-center gap-2 pt-2 text-[0.65rem] text-muted-foreground">
              <ShieldCheck className="size-3.5 shrink-0 text-primary" />
              <span>Simulasi untuk keperluan tugas. Nomor yang digunakan adalah dummy.</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
