import { z } from 'zod'

export const keysToExtract = ['color', 'sleeves', 'waist', 'fabric', 'neckline', 'hem'] as const

export const dressBuilderFormSchema = z.object({
  categoryId: z.string().min(1, { message: 'Category is required' }),
  styleId: z.string().min(1, { message: 'Style is required' }),
  color: z.string().min(1, { message: 'Color is required' }),
  sleeves: z.string().min(1, { message: 'Sleeves is required' }),
  waist: z.string().min(1, { message: 'Waist is required' }),
  fabric: z.string().min(1, { message: 'Fabric is required' }),
  neckline: z.string().min(1, { message: 'Neckline is required' }),
  hem: z.string().min(1, { message: 'Hem is required' })
})

export type DressBuilderFormSchema = z.infer<typeof dressBuilderFormSchema>
