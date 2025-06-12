import { z } from 'zod'

export const registerFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phoneNumber: z
    .string()
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' })
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(11, { message: 'Phone number must be less than 11 digits' })
    .refine(
      (phone) => {
        const vnMobilePrefixes = [
          '032',
          '033',
          '034',
          '035',
          '036',
          '037',
          '038',
          '039', // Viettel
          '070',
          '071',
          '072',
          '073',
          '074',
          '075',
          '076',
          '077',
          '078',
          '079', // MobiFone
          '081',
          '082',
          '083',
          '084',
          '085',
          '086',
          '087',
          '088',
          '089', // Vinaphone
          '090',
          '091',
          '092',
          '093',
          '094',
          '095',
          '096',
          '097',
          '098',
          '099' // Various
        ]
        return vnMobilePrefixes.some((prefix) => phone.startsWith(prefix))
      },
      { message: 'Phone number must start with a valid Vietnamese mobile prefix (e.g., 03x, 07x, 08x, 09x)' }
    ),
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
    .refine((password) => /[!@#$%^&*~_+-]/.test(password), {
      message: 'Password must contain at least one special character (e.g., !@#$%^&*~_+-)'
    }),
  code: z
    .string()
    .length(6, { message: 'Code must be exactly 6 digits' })
    .regex(/^\d+$/, { message: 'Code must contain only digits' })
})

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
