import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import orderService from '~/services/order.service'
import { placeDesignRequestOrderFormSchema, PlaceDesignRequestOrderFormSchema } from '../validations'

export const usePlaceDesignRequestOrder = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const methods = useForm<PlaceDesignRequestOrderFormSchema>({
    resolver: zodResolver(placeDesignRequestOrderFormSchema),
    defaultValues: {
      description: '',
      images: []
    }
  })

  const placeDesignRequestMutation = useMutation({
    mutationFn: orderService.placeDesignRequestOrder,
    onSuccess: (orderId) => {
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: ['order'] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['orders-count'] })

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

  return { methods, placeDesignRequestMutation }
}
