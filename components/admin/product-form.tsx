'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Product } from '@/lib/db/schema'
import { CATEGORIES } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProduct, updateProduct } from '@/app/actions/admin'

const labelClass = 'text-xs uppercase tracking-[0.2em] text-muted-foreground'

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [category, setCategory] = useState<string>(product?.category ?? 'tas')
  const [featured, setFeatured] = useState(product?.isFeatured ?? false)
  const [active, setActive] = useState(product?.isActive ?? true)
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('category', category)
    if (featured) formData.set('isFeatured', 'on')
    else formData.delete('isFeatured')
    if (active) formData.set('isActive', 'on')
    else formData.delete('isActive')

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      toast.success(product ? 'Produk diperbarui' : 'Produk ditambahkan')
      router.push('/admin/produk')
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className={labelClass}>Nama Produk</Label>
        <Input id="name" name="name" defaultValue={product?.name} required className="h-12 rounded-none" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className={labelClass}>Deskripsi</Label>
        <Textarea id="description" name="description" defaultValue={product?.description ?? ''} rows={5} className="rounded-none" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category" className={labelClass}>Kategori</Label>
          <Select value={category} onValueChange={(value) => value && setCategory(value)}>
            <SelectTrigger id="category" className="h-12 w-full rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="material" className={labelClass}>Material</Label>
          <Input id="material" name="material" defaultValue={product?.material ?? ''} placeholder="Kulit sapi full-grain" className="h-12 rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className={labelClass}>Harga (Rp)</Label>
          <Input id="price" name="price" type="number" min={1000} step={1000} defaultValue={product?.price} required className="h-12 rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock" className={labelClass}>Stok</Label>
          <Input id="stock" name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} required className="h-12 rounded-none" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className={labelClass}>Gambar (path atau URL)</Label>
        <Input id="image" name="image" defaultValue={product?.image ?? '/images/ransel-heritage.png'} required className="h-12 rounded-none" />
        <p className="text-xs text-muted-foreground">
          Contoh: /images/ransel-heritage.png atau https://.../foto.jpg
        </p>
      </div>

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-3 text-sm">
          <Switch checked={active} onCheckedChange={setActive} /> Tampilkan di toko
        </label>
        <label className="flex items-center gap-3 text-sm">
          <Switch checked={featured} onCheckedChange={setFeatured} /> Produk unggulan
        </label>
      </div>

      {error && (
        <p role="alert" className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="h-12 rounded-none px-10 text-xs uppercase tracking-[0.25em]">
          {pending ? 'Menyimpan...' : product ? 'Simpan Perubahan' : 'Tambah Produk'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()} className="h-12 rounded-none text-xs uppercase tracking-[0.25em]">
          Batal
        </Button>
      </div>
    </form>
  )
}
