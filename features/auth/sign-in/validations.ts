import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z.string().min(1, {
    message: 'Please enter your email or username'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  })
})

export type SignInSchema = z.infer<typeof signInSchema>
