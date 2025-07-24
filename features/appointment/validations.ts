import { z } from 'zod'

export const bookAppointmentFormSchema = z.object({
  userId: z.string().min(1, { message: 'User is required' }),
  branchId: z.string().min(1, { message: 'Branch is required' }),
  fullName: z.string().min(1, { message: 'Full name is required' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
  bookingTime: z.date(),
  note: z.string().optional(),
  status: z.enum(['UP_COMMING']),
  canceledAt: z.date().optional(),
  canceledReason: z.string().optional()
})

export type BookAppointmentFormSchema = z.infer<typeof bookAppointmentFormSchema>
