import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import userService from '~/services/user.service'
import { addAddressFormSchema, AddAddressFormSchema } from '../validations'

const defaultValues: AddAddressFormSchema = {
  mapId: '',
  province: '',
  district: '',
  ward: '',
  street: '',
  latitude: 0,
  longitude: 0,
  isDefault: false
}

export const useAddAddress = () => {
  const router = useRouter()

  const methods = useForm<AddAddressFormSchema>({
    defaultValues,
    resolver: zodResolver(addAddressFormSchema)
  })

  const addAddressMutation = useMutation({
    mutationFn: userService.addAddress,
    onSuccess: () => {
      methods.reset()
      if (router.canGoBack()) {
        router.back()
      } else {
        router.replace('/setting/my-addresses')
      }
    },
    onError: (error) => {
      methods.setError('root', { message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG })
    }
  })

  return { methods, addAddressMutation }
}
