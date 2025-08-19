import { z } from 'zod'

export const orderRatingSchema = z.object({
  orderItemId: z.string().min(1, { message: 'Vui lòng chọn sản phẩm' }),
  description: z
    .string()
    .min(1, { message: 'Vui lòng nhập mô tả' })
    .max(500, { message: 'Mô tả không được vượt quá 500 ký tự' }),
  images: z
    .array(z.string())
    .max(5, {
      message: 'Vui lòng chọn tối đa 5 ảnh'
    })
    .optional(),
  rated: z
    .number()
    .min(1, { message: 'Vui lòng đánh giá sản phẩm' })
    .max(5, { message: 'Đánh giá không được vượt quá 5 sao' })
})

export const rateOrderFormSchema = z.object({
  ratings: z.array(orderRatingSchema).min(1, { message: 'Vui lòng đánh giá ít nhất 1 sản phẩm' })
})

export type OrderRatingSchema = z.infer<typeof orderRatingSchema>
export type RateOrderFormSchema = z.infer<typeof rateOrderFormSchema>
