export const FREE_SHIPPING_THRESHOLD = 1_500_000
export const FLAT_SHIPPING = 25_000

export function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function shippingFor(subtotal: number) {
  if (subtotal <= 0) return 0
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
}

export const CATEGORIES = [
  { value: 'tas', label: 'Tas' },
  { value: 'dompet', label: 'Dompet' },
  { value: 'aksesoris', label: 'Aksesoris' },
] as const

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Menunggu Pembayaran' },
  { value: 'paid', label: 'Sudah Dibayar' },
  { value: 'processing', label: 'Sedang Diproses' },
  { value: 'shipped', label: 'Dikirim' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
  { value: 'expired', label: 'Kedaluwarsa' },
] as const

export function statusLabel(value: string) {
  return ORDER_STATUSES.find((s) => s.value === value)?.label ?? value
}

export const PAYMENT_LABELS: Record<string, string> = {
  bank_transfer: 'Transfer Bank (VA)',
  echannel: 'Mandiri Bill',
  gopay: 'GoPay',
  shopeepay: 'ShopeePay',
  qris: 'QRIS',
  dana: 'DANA',
  ovo: 'OVO',
  bca_va: 'BCA Virtual Account',
  bni_va: 'BNI Virtual Account',
  bri_va: 'BRI Virtual Account',
  mandiri_va: 'Mandiri Virtual Account',
  cstore: 'Gerai Retail',
}

export function paymentLabel(value: string | null | undefined) {
  if (!value) return '-'
  return PAYMENT_LABELS[value] ?? value
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}
