import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import warrantyService from '~/services/warranty.service'
import { createWarrantyRequestSchema, CreateWarrantyRequestSchema } from '../validations'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'

const defaultValues: CreateWarrantyRequestSchema = {
  warrantyOrderItemId: '',
  images: [],
  description: ''
}

export const useCreateWarrantyRequest = () => {
  const router = useRouter()
  const methods = useForm<CreateWarrantyRequestSchema>({
    defaultValues,
    resolver: zodResolver(createWarrantyRequestSchema)
  })

  const createWarrantyMutation = useMutation({
    mutationFn: warrantyService.createWarrantyRequest,
    onSuccess: (orderId) => {
      if (orderId) {
        router.replace({
          pathname: '/order/[orderId]',
          params: {
            orderId
          }
        })
      }
    },
    onError: (error) => {
      return toast.error(error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG)
    }
  })

  return { methods, createWarrantyMutation }
}
