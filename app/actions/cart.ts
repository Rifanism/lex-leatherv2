'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { cartItems, products } from '@/lib/db/schema'
import { getSessionUser } from '@/lib/session'

type Result = { ok: true } | { ok: false; error: string; needsLogin?: boolean }

export async function addToCart(
  productId: number,
  quantity: number,
): Promise<Result> {
  const user = await getSessionUser()
  if (!user) {
    return { ok: false, error: 'Silakan masuk untuk berbelanja', needsLogin: true }
  }

  const qty = Math.floor(quantity)
  if (!Number.isFinite(qty) || qty < 1 || qty > 20) {
    return { ok: false, error: 'Jumlah tidak valid' }
  }

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.isActive, true)))
    .limit(1)
  if (!product) return { ok: false, error: 'Produk tidak ditemukan' }

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)),
    )
    .limit(1)

  const nextQty = (existing?.quantity ?? 0) + qty
  if (nextQty > product.stock) {
    return { ok: false, error: `Stok tersisa ${product.stock} unit` }
  }

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: nextQty })
      .where(and(eq(cartItems.id, existing.id), eq(cartItems.userId, user.id)))
  } else {
    await db
      .insert(cartItems)
      .values({ userId: user.id, productId, quantity: qty })
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function updateCartQuantity(
  itemId: number,
  quantity: number,
): Promise<Result> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: 'Silakan masuk', needsLogin: true }

  const qty = Math.floor(quantity)
  if (!Number.isFinite(qty) || qty < 1) {
    return { ok: false, error: 'Jumlah tidak valid' }
  }

  const [item] = await db
    .select({ id: cartItems.id, stock: products.stock })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, user.id)))
    .limit(1)
  if (!item) return { ok: false, error: 'Item tidak ditemukan' }
  if (qty > item.stock) {
    return { ok: false, error: `Stok tersisa ${item.stock} unit` }
  }

  await db
    .update(cartItems)
    .set({ quantity: qty })
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, user.id)))

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function removeCartItem(itemId: number): Promise<Result> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: 'Silakan masuk', needsLogin: true }

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, user.id)))

  revalidatePath('/', 'layout')
  return { ok: true }
}
