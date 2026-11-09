import { and, asc, count, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  addresses,
  cartItems,
  orderItems,
  orders,
  products,
  user,
} from '@/lib/db/schema'

export type ProductFilters = {
  category?: string
  q?: string
  sort?: string
  featured?: boolean
  limit?: number
}

export async function getProducts(filters: ProductFilters = {}) {
  try {
    const conditions = [eq(products.isActive, true)]
    if (filters.category) conditions.push(eq(products.category, filters.category))
    if (filters.featured) conditions.push(eq(products.isFeatured, true))
    if (filters.q) {
      const term = `%${filters.q}%`
      conditions.push(
        or(ilike(products.name, term), ilike(products.description, term))!,
      )
    }

    const order =
      filters.sort === 'termurah'
        ? asc(products.price)
        : filters.sort === 'termahal'
          ? desc(products.price)
          : desc(products.createdAt)

    const query = db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(order)

    return filters.limit ? await query.limit(filters.limit) : await query
  } catch (error) {
    console.error('Failed to get products:', error)
    return []
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1)
    return row ?? null
  } catch (error) {
    console.error('Failed to get product by slug:', error)
    return null
  }
}

export async function getRelatedProducts(category: string, excludeId: number) {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.category, category)))
    .limit(5)
  return rows.filter((p) => p.id !== excludeId).slice(0, 4)
}

export async function getCartItems(userId: string) {
  return db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      productId: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      stock: products.stock,
      image: products.image,
      isActive: products.isActive,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId))
    .orderBy(desc(cartItems.createdAt))
}

export async function getCartCount(userId: string) {
  try {
    const [row] = await db
      .select({ total: sql<number>`coalesce(sum(${cartItems.quantity}), 0)::int` })
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
    return row?.total ?? 0
  } catch (error) {
    console.error('Failed to get cart count:', error)
    return 0
  }
}

export async function getAddresses(userId: string) {
  return db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt))
}

export async function getUserOrders(userId: string) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
}

export async function getOrderByCode(code: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.code, code))
    .limit(1)
  if (!order) return null
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
  return { order, items }
}

export async function getOrderItemPreviews(orderIds: number[]) {
  if (orderIds.length === 0) return []
  return db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
}

const REVENUE_STATUSES = ['paid', 'processing', 'shipped', 'completed']

export async function getAdminStats() {
  try {
    const [revenue] = await db
      .select({
        total: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
        count: count(),
      })
      .from(orders)
      .where(inArray(orders.status, REVENUE_STATUSES))

    const [pending] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, 'pending'))

    const [toShip] = await db
      .select({ count: count() })
      .from(orders)
      .where(inArray(orders.status, ['paid', 'processing']))

    const [customers] = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.role, 'customer'))

    const [productCount] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true))

    const daily = await db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${orders.createdAt}), 'YYYY-MM-DD')`,
        total: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
      })
      .from(orders)
      .where(
        and(
          inArray(orders.status, REVENUE_STATUSES),
          sql`${orders.createdAt} >= now() - interval '6 days'`,
        ),
      )
      .groupBy(sql`date_trunc('day', ${orders.createdAt})`)

    const lowStock = await db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), sql`${products.stock} <= 5`))
      .orderBy(asc(products.stock))
      .limit(5)

    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(6)

    return {
      revenue: revenue?.total ?? 0,
      paidOrders: revenue?.count ?? 0,
      pending: pending?.count ?? 0,
      toShip: toShip?.count ?? 0,
      customers: customers?.count ?? 0,
      activeProducts: productCount?.count ?? 0,
      daily,
      lowStock,
      recentOrders,
    }
  } catch (error) {
    console.error('Failed to get admin stats:', error)
    return {
      revenue: 0,
      paidOrders: 0,
      pending: 0,
      toShip: 0,
      customers: 0,
      activeProducts: 0,
      daily: [],
      lowStock: [],
      recentOrders: [],
    }
  }
}

export async function getAllOrders(status?: string) {
  const query = db
    .select({
      order: orders,
      customerName: user.name,
      customerEmail: user.email,
    })
    .from(orders)
    .leftJoin(user, eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
  return status && status !== 'all'
    ? query.where(eq(orders.status, status))
    : query
}

export async function getAllProducts() {
  return db.select().from(products).orderBy(desc(products.createdAt))
}

export async function getProductById(id: number) {
  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)
  return row ?? null
}

export async function getCustomers() {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      orderCount: sql<number>`(select count(*) from ${orders} where ${orders.userId} = ${user.id})::int`,
      totalSpent: sql<number>`coalesce((select sum(${orders.total}) from ${orders} where ${orders.userId} = ${user.id} and ${orders.status} in ('paid','processing','shipped','completed')), 0)::int`,
    })
    .from(user)
    .where(eq(user.role, 'customer'))
    .orderBy(desc(user.createdAt))
}
