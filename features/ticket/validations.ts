import { z } from 'zod'
import { TicketType } from '~/types/ticket.type'

export const createTicketFormSchema = z.object({
  orderItemId: z.string().min(1, { message: 'Order item ID is required' }),
  title: z.string().min(1, { message: 'Title is required' }).max(100, { message: 'Title is too long' }),
  images: z.array(z.string().url({ message: 'Invalid URL format' })).min(2, { message: 'At least 2 images' }),
  videos: z.array(z.string().url({ message: 'Invalid URL format' })).max(1, { message: 'Maximum 1 video allowed' }),
  type: z.enum([TicketType.WarrantyService, TicketType.DeliveryService, TicketType.Other], {
    message: 'Type is required'
  }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(500, { message: 'Description is too long' })
})

export type CreateTicketFormSchema = z.infer<typeof createTicketFormSchema>
