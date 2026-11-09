import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { orderItems, orders, products } from '@/lib/db/schema'

export type PaymentUpdate = {
  transactionStatus: string
  fraudStatus?: string
  paymentType?: string
}

function mapStatus({ transactionStatus, fraudStatus }: PaymentUpdate) {
  switch (transactionStatus) {
    case 'settlement':
      return 'paid'
    case 'capture':
      return fraudStatus === 'challenge' ? 'pending' : 'paid'
    case 'deny':
    case 'cancel':
    case 'failure':
      return 'cancelled'
    case 'expire':
      return 'expired'
    default:
      return 'pending'
  }
}

export async function restoreStock(orderId: number) {
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))
  for (const item of items) {
    if (!item.productId) continue
    await db
      .update(products)
      .set({ stock: sql`${products.stock} + ${item.quantity}` })
      .where(eq(products.id, item.productId))
  }
}

export async function applyPaymentUpdate(code: string, update: PaymentUpdate) {
  const next = mapStatus(update)

  if (next === 'pending') {
    if (update.paymentType) {
      await db
        .update(orders)
        .set({ paymentType: update.paymentType, updatedAt: new Date() })
        .where(and(eq(orders.code, code), eq(orders.status, 'pending')))
    }
    return 'pending'
  }

  const changed = await db
    .update(orders)
    .set({
      status: next,
      paymentType: update.paymentType,
      paidAt: next === 'paid' ? new Date() : undefined,
      updatedAt: new Date(),
    })
    .where(and(eq(orders.code, code), eq(orders.status, 'pending')))
    .returning({ id: orders.id })

  if (changed.length > 0 && (next === 'cancelled' || next === 'expired')) {
    await restoreStock(changed[0].id)
  }
  return next
}
