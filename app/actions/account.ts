'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { addresses, user } from '@/lib/db/schema'
import { requireUserAction } from '@/lib/session'

type Result = { ok: true } | { ok: false; error: string }

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,16}$/, 'Nomor telepon tidak valid')
    .or(z.literal('')),
})

export async function updateProfile(
  input: z.infer<typeof profileSchema>,
): Promise<Result> {
  const current = await requireUserAction()
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data tidak valid' }
  }
  await db
    .update(user)
    .set({
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, current.id))
  revalidatePath('/', 'layout')
  return { ok: true }
}

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

export async function addAddress(
  input: z.infer<typeof addressSchema>,
): Promise<Result> {
  const current = await requireUserAction()
  const parsed = addressSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data tidak valid' }
  }
  const existing = await db
    .select({ id: addresses.id })
    .from(addresses)
    .where(eq(addresses.userId, current.id))
    .limit(1)
  await db.insert(addresses).values({
    ...parsed.data,
    userId: current.id,
    isDefault: existing.length === 0,
  })
  revalidatePath('/akun')
  return { ok: true }
}

export async function deleteAddress(id: number): Promise<Result> {
  const current = await requireUserAction()
  await db
    .delete(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, current.id)))
  revalidatePath('/akun')
  return { ok: true }
}

export async function setDefaultAddress(id: number): Promise<Result> {
  const current = await requireUserAction()
  await db
    .update(addresses)
    .set({ isDefault: false })
    .where(eq(addresses.userId, current.id))
  await db
    .update(addresses)
    .set({ isDefault: true })
    .where(and(eq(addresses.id, id), eq(addresses.userId, current.id)))
  revalidatePath('/akun')
  return { ok: true }
}
