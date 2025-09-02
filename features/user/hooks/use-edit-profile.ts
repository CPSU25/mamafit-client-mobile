import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import userService from '~/services/user.service'
import { editProfileFormSchema, EditProfileFormSchema } from '../validations'

export const useEditProfile = (defaultValues: EditProfileFormSchema) => {
  const queryClient = useQueryClient()
  const methods = useForm<EditProfileFormSchema>({
    defaultValues,
    resolver: zodResolver(editProfileFormSchema)
  })

  const editProfileMutation = useMutation({
    mutationFn: userService.editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
    onError: (error) => {
      toast.error(error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG)
      methods.setError('root', { message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG })
    }
  })

  return { methods, editProfileMutation }
}
