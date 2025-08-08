import { z } from 'zod'
import { OrderItemType } from '~/types/order.type'

export const addToCartFormSchema = z.object({
  itemId: z.string().min(1, { message: 'Item ID is required' }),
  quantity: z.number().min(1, { message: 'Quantity is required' }),
  type: z.enum([OrderItemType.Preset, OrderItemType.ReadyToBuy], { message: 'Type is required' })
})

export const updateCartItemFormSchema = z.object({
  itemId: z.string().min(1, { message: 'Item ID is required' }),
  type: z.enum([OrderItemType.Preset, OrderItemType.ReadyToBuy], { message: 'Type is required' }),
  quantity: z
    .number()
    .min(1, { message: 'Quantity must be at least 1' })
    .max(99, { message: 'Quantity cannot exceed 99' })
})

export type AddToCartFormSchema = z.infer<typeof addToCartFormSchema>
export type UpdateCartItemFormSchema = z.infer<typeof updateCartItemFormSchema>
