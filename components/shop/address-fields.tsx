import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const emptyAddress = {
  label: 'Rumah',
  recipientName: '',
  phone: '',
  street: '',
  city: '',
  province: '',
  postalCode: '',
}

export type AddressValues = typeof emptyAddress

const fields: {
  key: keyof AddressValues
  label: string
  placeholder: string
  span?: boolean
  inputMode?: 'tel' | 'numeric'
  autoComplete?: string
}[] = [
  { key: 'label', label: 'Label Alamat', placeholder: 'Rumah / Kos / Kampus' },
  { key: 'recipientName', label: 'Nama Penerima', placeholder: 'Nama lengkap', autoComplete: 'name' },
  { key: 'phone', label: 'Nomor Telepon', placeholder: '08xxxxxxxxxx', inputMode: 'tel', autoComplete: 'tel' },
  { key: 'postalCode', label: 'Kode Pos', placeholder: '5 digit', inputMode: 'numeric', autoComplete: 'postal-code' },
  { key: 'street', label: 'Alamat Lengkap', placeholder: 'Jalan, nomor, RT/RW, kelurahan', span: true, autoComplete: 'street-address' },
  { key: 'city', label: 'Kota / Kabupaten', placeholder: 'Bandung' },
  { key: 'province', label: 'Provinsi', placeholder: 'Jawa Barat' },
]

export function AddressFields({
  values,
  onChange,
  idPrefix = 'addr',
}: {
  values: AddressValues
  onChange: (next: AddressValues) => void
  idPrefix?: string
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.span ? 'space-y-2 sm:col-span-2' : 'space-y-2'}>
          <Label htmlFor={`${idPrefix}-${f.key}`} className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.label}
          </Label>
          <Input
            id={`${idPrefix}-${f.key}`}
            value={values[f.key]}
            placeholder={f.placeholder}
            inputMode={f.inputMode}
            autoComplete={f.autoComplete}
            className="h-11 rounded-none"
            required
            onChange={(e) => onChange({ ...values, [f.key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  )
}
