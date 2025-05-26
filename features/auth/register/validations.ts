import { z } from 'zod'

// TODO: Improve phone number validation
export const registerFormSchema = z.object({
  email: z.string().email(),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(11, { message: 'Phone number must be at most 11 digits' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be less than 20 characters' })
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Password must contain at least one uppercase letter'
    })
    .refine((password) => /[a-z]/.test(password), {
      message: 'Password must contain at least one lowercase letter'
    })
    .refine((password) => /[0-9]/.test(password), { message: 'Password must contain at least one number' })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: 'Password must contain at least one special character'
    }),
  code: z.string().length(6, { message: 'Code must be 6 digits' })
})

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
