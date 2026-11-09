'use server'

import { and, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import {
  addresses,
  cartItems,
  orderItems,
  orders,
  products,
} from '@/lib/db/schema'
import { shippingFor } from '@/lib/format'
import { applyPaymentUpdate, restoreStock } from '@/lib/payment'
import { requireUserAction } from '@/lib/session'

const addressSchema = z.object({
  label: z.string().trim().min(1).max(30),
  recipientName: z.string().trim().min(2, 'Nama penerima wajib diisi').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,16}$/, 'Nomor telepon tidak valid'),
  street: z.string().trim().min(5, 'Alamat lengkap wajib diisi').max(300),
  city: z.string().trim().min(2, 'Kota wajib diisi').max(80),
  province: z.string().trim().min(2, 'Provinsi wajib diisi').max(80),
  postalCode: z
    .string()
    .trim()
    .regex(/^[0-9]{5}$/, 'Kode pos harus 5 digit'),
})

const checkoutSchema = z.object({
  addressId: z.number().int().positive().optional(),
  newAddress: addressSchema.optional(),
  note: z.string().trim().max(300).optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

type CreateResult = { ok: true; code: string } | { ok: false; error: string }

function generateCode() {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `AUR-${date}-${rand}`
}

export async function createOrder(input: CheckoutInput): Promise<CreateResult> {
  const user = await requireUserAction()
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data tidak valid' }
  }
  const { addressId, newAddress, note } = parsed.data

  const cart = await db
    .select({
      cartId: cartItems.id,
      quantity: cartItems.quantity,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id))

  if (cart.length === 0) return { ok: false, error: 'Keranjang kosong' }
  if (cart.some((c) => !c.product.isActive)) {
    return { ok: false, error: 'Ada produk yang sudah tidak tersedia' }
  }

  let shipTo: z.infer<typeof addressSchema>
  if (addressId) {
    const [found] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, user.id)))
      .limit(1)
    if (!found) return { ok: false, error: 'Alamat tidak ditemukan' }
    shipTo = found
  } else if (newAddress) {
    shipTo = newAddress
    const existing = await db
      .select({ id: addresses.id })
      .from(addresses)
      .where(eq(addresses.userId, user.id))
      .limit(1)
    await db
      .insert(addresses)
      .values({ ...newAddress, userId: user.id, isDefault: existing.length === 0 })
  } else {
    return { ok: false, error: 'Pilih atau isi alamat pengiriman' }
  }

  const subtotal = cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0)
  const shippingCost = shippingFor(subtotal)
  const code = generateCode()

  try {
    await db.transaction(async (tx) => {
      for (const c of cart) {
        const updated = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${c.quantity}` })
          .where(
            and(eq(products.id, c.product.id), sql`${products.stock} >= ${c.quantity}`),
          )
          .returning({ id: products.id })
        if (updated.length === 0) {
          throw new Error(`Stok "${c.product.name}" tidak mencukupi`)
        }
      }

      const [order] = await tx
        .insert(orders)
        .values({
          code,
          userId: user.id,
          status: 'pending',
          subtotal,
          shippingCost,
          total: subtotal + shippingCost,
          recipientName: shipTo.recipientName,
          phone: shipTo.phone,
          address: `${shipTo.street}, ${shipTo.city}, ${shipTo.province} ${shipTo.postalCode}`,
          note: note || null,
        })
        .returning({ id: orders.id })

      await tx.insert(orderItems).values(
        cart.map((c) => ({
          orderId: order.id,
          productId: c.product.id,
          name: c.product.name,
          price: c.product.price,
          quantity: c.quantity,
          image: c.product.image,
        })),
      )

      await tx.delete(cartItems).where(eq(cartItems.userId, user.id))
    })
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Gagal membuat pesanan',
    }
  }

  revalidatePath('/', 'layout')
  return { ok: true, code }
}

async function getOwnedOrder(code: string, userId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.code, code), eq(orders.userId, userId)))
    .limit(1)
  return order ?? null
}

const SIMULATED_METHODS = [
  'bca_va',
  'bni_va',
  'bri_va',
  'mandiri_va',
  'gopay',
  'shopeepay',
  'dana',
  'ovo',
  'qris',
] as const

export async function simulatePayment(code: string, method: string) {
  const user = await requireUserAction()
  if (!SIMULATED_METHODS.includes(method as (typeof SIMULATED_METHODS)[number])) {
    return { ok: false as const, error: 'Metode tidak valid' }
  }
  const order = await getOwnedOrder(code, user.id)
  if (!order) return { ok: false as const, error: 'Pesanan tidak ditemukan' }
  if (order.status !== 'pending') {
    return { ok: false as const, error: 'Pesanan ini tidak menunggu pembayaran' }
  }

  await applyPaymentUpdate(code, {
    transactionStatus: 'settlement',
    paymentType: method,
  })
  revalidatePath('/', 'layout')
  return { ok: true as const }
}

export async function cancelOrder(code: string) {
  const user = await requireUserAction()
  const order = await getOwnedOrder(code, user.id)
  if (!order) return { ok: false as const, error: 'Pesanan tidak ditemukan' }

  const changed = await db
    .update(orders)
    .set({ status: 'cancelled', updatedAt: new Date() })
    .where(and(eq(orders.id, order.id), eq(orders.status, 'pending')))
    .returning({ id: orders.id })

  if (changed.length === 0) {
    return { ok: false as const, error: 'Pesanan tidak dapat dibatalkan' }
  }
  await restoreStock(order.id)
  revalidatePath('/', 'layout')
  return { ok: true as const }
}

export async function confirmReceived(code: string) {
  const user = await requireUserAction()
  const order = await getOwnedOrder(code, user.id)
  if (!order) return { ok: false as const, error: 'Pesanan tidak ditemukan' }

  await db
    .update(orders)
    .set({ status: 'completed', updatedAt: new Date() })
    .where(and(eq(orders.id, order.id), eq(orders.status, 'shipped')))
  revalidatePath('/', 'layout')
  return { ok: true as const }
}
