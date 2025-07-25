import { parse, parseISO } from 'date-fns'
import { z } from 'zod'

export const bookAppointmentFormSchema = z
  .object({
    branchId: z.string().min(1, { message: 'Branch is required' }),
    bookingTime: z.string().optional(), // Will be set in superRefine
    bookingDate: z.string().min(1, { message: 'Booking date is required' }), // "yyyy-MM-dd"
    bookingSlot: z.string().min(1, { message: 'Booking slot is required' }), // "HH:mm:ss"
    note: z.string().optional()
  })
  .superRefine((values, ctx) => {
    const { bookingDate, bookingSlot } = values
    if (bookingDate && bookingSlot) {
      const dateTimeString = `${bookingDate} ${bookingSlot}` // e.g., "2025-07-27 13:00:00"
      const bookingDateTime = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date())
      if (isNaN(bookingDateTime.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid date or time format'
        })
        return
      }
      // Set bookingTime in ISO 8601 format (e.g. "2025-07-25T04:08:15.583Z")
      values.bookingTime = bookingDateTime.toISOString()
      // Validate booking time is in the future
      if (bookingDateTime < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Booking time must be in the future'
        })
      }
    }
  })

export type BookAppointmentFormSchema = z.infer<typeof bookAppointmentFormSchema>
