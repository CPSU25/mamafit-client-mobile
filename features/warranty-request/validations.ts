import { z } from 'zod'

export const createWarrantyRequestSchema = z.object({
  warrantyOrderItemId: z.string().min(1, { message: 'Order item ID is required' }),
  images: z
    .array(z.string().url({ message: 'Invalid URL format' }))
    .min(2, { message: 'At least 2 images are required' }),
  description: z.string().min(1, { message: 'Description is required' })
})

export type CreateWarrantyRequestSchema = z.infer<typeof createWarrantyRequestSchema>
