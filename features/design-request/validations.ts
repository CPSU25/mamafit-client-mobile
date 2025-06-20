import { z } from 'zod'

export const createRequestSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description is too long' }),
  // images: z.array(z.string().url({ message: 'Invalid URL format' }))
  // TODO: remove this after testing
  images: z.array(z.string())
})

export type CreateRequestSchema = z.infer<typeof createRequestSchema>
