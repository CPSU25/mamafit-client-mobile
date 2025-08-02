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

// Schema for add-on option in form
export const addOnOptionFormSchema = z.object({
  addOnOptionId: z.string().min(1, { message: 'Option ID is required' }),
  value: z.string()
})

// Schema for preset order placement
export const placePresetOrderFormSchema = z
  .object({
    presetId: z.string().min(1, { message: 'Preset is required' }),
    addressId: z.string().nullable(),
    branchId: z.string().nullable(),
    shippingFee: z.number().min(0, { message: 'Shipping fee is required' }),
    voucherDiscountId: z.string().nullable(),
    measurementDiaryId: z.string().min(1, { message: 'Measurement diary is required' }),
    measurementId: z.string().min(1, { message: 'Measurement is required' }),
    options: z.array(addOnOptionFormSchema),
    isOnline: z.boolean(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    paymentType: z.nativeEnum(PaymentType),
    deliveryMethod: z.nativeEnum(DeliveryMethod)
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === DeliveryMethod.DELIVERY && !data.addressId) {
      ctx.addIssue({
        path: ['addressId'],
        code: z.ZodIssueCode.custom,
        message: 'Please add your address for delivery.'
      })
    }

    if (data.deliveryMethod === DeliveryMethod.PICK_UP && !data.branchId) {
      ctx.addIssue({
        path: ['branchId'],
        code: z.ZodIssueCode.custom,
        message: 'Please select a branch for pick up.'
      })
    }

    // Require shippingFee > 0 for DELIVERY
    if (data.deliveryMethod === DeliveryMethod.DELIVERY && (!data.shippingFee || data.shippingFee <= 0)) {
      ctx.addIssue({
        path: ['shippingFee'],
        code: z.ZodIssueCode.custom,
        message: 'Shipping fee must be greater than 0 for delivery.'
      })
    }
  })

// Schema for design request order placement
export const placeDesignRequestOrderFormSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description is too long' }),
  images: z.array(z.string().url({ message: 'Invalid URL format' }))
})

// Schema for adding new add-on option
export const selectAddOnOptionFormSchema = z
  .object({
    addOnId: z.string().min(1, { message: 'Add-on is required' }),
    positionId: z.string().min(1, { message: 'Position is required' }),
    positionName: z.string().min(1, { message: 'Position is required' }),
    sizeId: z.string().min(1, { message: 'Size is required' }),
    sizeName: z.string().min(1, { message: 'Size is required' }),
    type: z.string().min(1, { message: 'Type is required' }),
    value: z.string()
  })
  .superRefine((data, ctx) => {
    if (data.type !== 'PATTERN' && !data.value) {
      ctx.addIssue({
        path: ['value'],
        code: z.ZodIssueCode.custom,
        message: 'Content is required'
      })
    }
  })

export type AddOnOptionFormSchema = z.infer<typeof addOnOptionFormSchema>
export type PlacePresetOrderFormSchema = z.infer<typeof placePresetOrderFormSchema>
export type PlaceDesignRequestOrderFormSchema = z.infer<typeof placeDesignRequestOrderFormSchema>
export type SelectAddOnOptionFormSchema = z.infer<typeof selectAddOnOptionFormSchema>
