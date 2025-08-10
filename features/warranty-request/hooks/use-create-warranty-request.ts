import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import warrantyService from '~/services/warranty.service'
import { DeliveryMethod, PaymentMethod } from '~/types/order.type'
import { createWarrantyRequestSchema, CreateWarrantyRequestSchema } from '../validations'

const defaultValues: CreateWarrantyRequestSchema = {
  addressId: null,
  branchId: null,
  deliveryMethod: DeliveryMethod.Delivery,
  paymentMethod: PaymentMethod.OnlineBanking,
  items: []
}

export const useCreateWarrantyRequest = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const methods = useForm<CreateWarrantyRequestSchema>({
    defaultValues,
    resolver: zodResolver(createWarrantyRequestSchema)
  })

  const createWarrantyMutation = useMutation({
    mutationFn: warrantyService.createWarrantyRequest,
    onSuccess: (orderId) => {
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['orders-count'] })
        queryClient.invalidateQueries({ queryKey: ['order-requests'] })
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
