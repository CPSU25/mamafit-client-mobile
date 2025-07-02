import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import orderService from '~/services/order'
import { createRequestSchema, CreateRequestSchema } from '../validations'

export const useCreateDesignRequest = () => {
  const router = useRouter()
  const methods = useForm<CreateRequestSchema>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      description: '',
      images: []
    }
  })

  const createDesignRequestMutation = useMutation({
    mutationFn: orderService.createDesignRequest,
    onSuccess: (orderId) => {
      if (orderId) {
        router.replace({
          pathname: '/payment/[orderId]/qr-code',
          params: { orderId }
        })
        methods.reset()
      }
    },
    onError: (error) => {
      methods.setError('root', { message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG })
    }
  })

  return { methods, createDesignRequestMutation }
}
