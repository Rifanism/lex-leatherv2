'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { cartItems, orderItems, orders, products } from '@/lib/db/schema'
import { ORDER_STATUSES, slugify } from '@/lib/format'
import { restoreStock } from '@/lib/payment'
import { requireAdminAction } from '@/lib/session'

type Result = { ok: true } | { ok: false; error: string }

const productSchema = z.object({
  name: z.string().trim().min(3, 'Nama produk minimal 3 karakter').max(120),
  description: z.string().trim().max(2000),
  category: z.enum(['tas', 'dompet', 'aksesoris']),
  price: z.coerce.number().int().min(1000, 'Harga minimal Rp1.000'),
  stock: z.coerce.number().int().min(0, 'Stok tidak boleh negatif'),
  image: z
    .string()
    .trim()
    .regex(/^(\/|https?:\/\/)/, 'Gambar harus berupa path (/images/...) atau URL'),
  material: z.string().trim().max(120).optional(),
})

function parseProduct(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') ?? '',
    category: formData.get('category'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    image: formData.get('image'),
    material: formData.get('material') ?? undefined,
  })
}

async function uniqueSlug(name: string, ignoreId?: number) {
  const base = slugify(name) || 'produk'
  let slug = base
  let n = 1
  while (true) {
    const [hit] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1)
    if (!hit || hit.id === ignoreId) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

export async function createProduct(formData: FormData): Promise<Result> {
  await requireAdminAction()
  const parsed = parseProduct(formData)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data tidak valid' }
  }
  await db.insert(products).values({
    ...parsed.data,
    material: parsed.data.material || null,
    slug: await uniqueSlug(parsed.data.name),
    isFeatured: formData.get('isFeatured') === 'on',
    isActive: formData.get('isActive') === 'on',
  })
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function updateProduct(
  id: number,
  formData: FormData,
): Promise<Result> {
  await requireAdminAction()
  const parsed = parseProduct(formData)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data tidak valid' }
  }
  await db
    .update(products)
    .set({
      ...parsed.data,
      material: parsed.data.material || null,
      slug: await uniqueSlug(parsed.data.name, id),
      isFeatured: formData.get('isFeatured') === 'on',
      isActive: formData.get('isActive') === 'on',
    })
    .where(eq(products.id, id))
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteProduct(id: number): Promise<Result> {
  await requireAdminAction()
  const used = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .where(eq(orderItems.productId, id))
    .limit(1)

  if (used.length > 0) {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id))
  } else {
    await db.delete(cartItems).where(eq(cartItems.productId, id))
    await db.delete(products).where(eq(products.id, id))
  }
  revalidatePath('/', 'layout')
  return { ok: true }
}

const statusValues = ORDER_STATUSES.map((s) => s.value) as [string, ...string[]]

const orderUpdateSchema = z.object({
  status: z.enum(statusValues),
  trackingNumber: z.string().trim().max(60).optional(),
})

export async function updateOrderStatus(
  code: string,
  input: z.infer<typeof orderUpdateSchema>,
): Promise<Result> {
  await requireAdminAction()
  const parsed = orderUpdateSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Status tidak valid' }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.code, code))
    .limit(1)
  if (!order) return { ok: false, error: 'Pesanan tidak ditemukan' }

  const { status, trackingNumber } = parsed.data
  if (status === 'shipped' && !trackingNumber && !order.trackingNumber) {
    return { ok: false, error: 'Isi nomor resi sebelum menandai dikirim' }
  }

  const wasOpen = !['cancelled', 'expired'].includes(order.status)
  const nowClosed = ['cancelled', 'expired'].includes(status)

  await db
    .update(orders)
    .set({
      status,
      trackingNumber: trackingNumber || order.trackingNumber,
      paidAt: status === 'paid' && !order.paidAt ? new Date() : order.paidAt,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id))

  if (wasOpen && nowClosed) await restoreStock(order.id)

  revalidatePath('/', 'layout')
  return { ok: true }
}
