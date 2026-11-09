import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  phone: text('phone'),
  role: text('role').notNull().default('customer'),
})

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull().default(0),
  image: text('image').notNull().default(''),
  material: text('material'),
  isFeatured: boolean('is_featured').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  label: text('label').notNull().default('Rumah'),
  recipientName: text('recipient_name').notNull(),
  phone: text('phone').notNull(),
  street: text('street').notNull(),
  city: text('city').notNull(),
  province: text('province').notNull(),
  postalCode: text('postal_code').notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  userId: text('userId').notNull(),
  status: text('status').notNull().default('pending'),
  subtotal: integer('subtotal').notNull(),
  shippingCost: integer('shipping_cost').notNull().default(0),
  total: integer('total').notNull(),
  recipientName: text('recipient_name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  note: text('note'),
  snapToken: text('snap_token'),
  snapRedirectUrl: text('snap_redirect_url'),
  paymentType: text('payment_type'),
  trackingNumber: text('tracking_number'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id'),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  quantity: integer('quantity').notNull(),
  image: text('image'),
})

export type Product = typeof products.$inferSelect
export type Address = typeof addresses.$inferSelect
export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect
