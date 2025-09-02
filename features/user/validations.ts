import { z } from 'zod'

export const addAddressFormSchema = z.object({
  mapId: z.string().min(1, { message: 'Map ID is required' }).trim(),
  province: z.string().min(1, { message: 'Province is required' }).trim(),
  district: z.string().min(1, { message: 'District is required' }).trim(),
  ward: z.string().min(1, { message: 'Ward is required' }).trim(),
  street: z.string().min(1, { message: 'Street is required' }).trim(),
  latitude: z.number().min(1, { message: 'Latitude is required' }),
  longitude: z.number().min(1, { message: 'Longitude is required' }),
  isDefault: z.boolean()
})

export const editProfileFormSchema = z
  .object({
    fullName: z.string().min(1, { message: 'Full name is required' }).trim(),
    profilePicture: z.string().optional(),
    userName: z.string().min(1, { message: 'Username is required' }).trim(),
    userEmail: z.string().email({ message: 'Invalid email address' }),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }).trim()
  })
  .refine(
    (data) => {
      // If either password field is filled, both must be filled
      const hasOldPassword = data.oldPassword && data.oldPassword.trim().length > 0
      const hasNewPassword = data.newPassword && data.newPassword.trim().length > 0

      if (hasOldPassword || hasNewPassword) {
        return hasOldPassword && hasNewPassword
      }

      return true
    },
    {
      message: 'Both old and new passwords are required when changing password',
      path: ['newPassword']
    }
  )

export type AddAddressFormSchema = z.infer<typeof addAddressFormSchema>
export type EditProfileFormSchema = z.infer<typeof editProfileFormSchema>
