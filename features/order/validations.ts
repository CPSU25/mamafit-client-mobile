import { z } from 'zod'

export enum PaymentType {
  FULL = 'FULL',
  DEPOSIT = 'DEPOSIT'
}

export enum DeliveryMethod {
  PICK_UP = 'PICK_UP',
  DELIVERY = 'DELIVERY'
}

export enum PaymentMethod {
  CASH = 'CASH',
  ONLINE_BANKING = 'ONLINE_BANKING'
}

// Schema for preset order placement
export const placePresetOrderFormSchema = z.object({
  presetId: z.string().min(1, { message: 'Preset is required' }),
  addressId: z.string().nullable(),
  branchId: z.string().nullable(),
  shippingFee: z.number().min(0, { message: 'Shipping fee is required' }),
  voucherDiscountId: z.string().nullable(),
  measurementDiaryId: z.string().nullable(),
  isOnline: z.boolean(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentType: z.nativeEnum(PaymentType),
  deliveryMethod: z.nativeEnum(DeliveryMethod)
})

// Schema for design request order placement
export const placeDesignRequestOrderFormSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description is too long' }),
  images: z.array(z.string().url({ message: 'Invalid URL format' }))
})

export type PlacePresetOrderFormSchema = z.infer<typeof placePresetOrderFormSchema>
export type PlaceDesignRequestOrderFormSchema = z.infer<typeof placeDesignRequestOrderFormSchema>
