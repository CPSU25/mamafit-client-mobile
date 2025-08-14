import { z } from 'zod'
import { DeliveryMethod, PaymentMethod } from '~/types/order.type'

export const warrantyRequestSchema = z.object({
  orderItemId: z.string().min(1, { message: 'Order item ID is required' }),
  images: z.array(z.string().url({ message: 'Invalid URL format' })).min(2, { message: 'At least 2 images' }),
  videos: z
    .array(z.string().url({ message: 'Invalid URL format' }))
    .max(1, { message: 'Maximum 1 video allowed' })
    .optional(),
  description: z.string().min(1, { message: 'Description is required' })
})

export const createWarrantyRequestSchema = z
  .object({
    addressId: z.string().nullable(),
    branchId: z.string().nullable(),
    deliveryMethod: z.enum([DeliveryMethod.Delivery, DeliveryMethod.PickUp]),
    paymentMethod: z.enum([PaymentMethod.Cash, PaymentMethod.OnlineBanking]),
    items: z.array(warrantyRequestSchema)
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === DeliveryMethod.Delivery && !data.addressId) {
      ctx.addIssue({
        path: ['addressId'],
        code: z.ZodIssueCode.custom,
        message: 'Please add your address for delivery.'
      })
    }

    if (data.deliveryMethod === DeliveryMethod.PickUp && !data.branchId) {
      ctx.addIssue({
        path: ['branchId'],
        code: z.ZodIssueCode.custom,
        message: 'Please select a branch for pick up.'
      })
    }
  })

export type CreateWarrantyRequestSchema = z.infer<typeof createWarrantyRequestSchema>
