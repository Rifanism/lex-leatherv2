import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { WhatsAppConcierge } from '@/components/site/whatsapp-concierge'

export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
      <WhatsAppConcierge />
    </>
  )
}
