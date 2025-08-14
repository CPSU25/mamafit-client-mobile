import { z } from 'zod'

export const addAddressFormSchema = z.object({
  mapId: z.string().min(1, { message: 'Map ID is required' }).trim(),
  province: z.string().min(1, { message: 'Province is required' }).trim(),
  district: z.string().min(1, { message: 'District is required' }).trim(),
  ward: z.string().min(1, { message: 'Ward is required' }).trim(),
  street: z.string().min(1, { message: 'Street is required' }).trim(),
  latitude: z.number().min(1, { message: 'Latitude is required' }),
  longitude: z.number().min(1, { message: 'Longitude is required' }),
  isDefault: z.boolean()
})

export type AddAddressFormSchema = z.infer<typeof addAddressFormSchema>
