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
export const placeOrderPresetFormSchema = z.object({
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

export type PlaceOrderPresetFormSchema = z.infer<typeof placeOrderPresetFormSchema>
