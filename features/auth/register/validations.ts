import { z } from 'zod'

const strongPasswordSchema = z.object({
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
    })
})

export const registerFormSchema = strongPasswordSchema
  .extend({
    email: z.string().email(),
    code: z.string().length(6, { message: 'Code must be 6 digits' }),
    confirmPassword: z.string().min(8, { message: 'Confirm password must be at least 8 characters long' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
  })

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
