import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import orderService from '~/services/order.service'
import { DeliveryMethod, PaymentMethod, PaymentType } from '~/types/order.type'
import { placeDressOrderFormSchema, PlaceDressOrderFormSchema } from '../validations'

const defaultValues: PlaceDressOrderFormSchema = {
  orderItems: [],
  addressId: null,
  branchId: null,
  shippingFee: 0,
  voucherDiscountId: null,
  isOnline: true,
  paymentMethod: PaymentMethod.OnlineBanking,
  paymentType: PaymentType.Full,
  deliveryMethod: DeliveryMethod.Delivery
}

export const usePlaceDressOrder = (onSuccess: () => void) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const methods = useForm<PlaceDressOrderFormSchema>({
    defaultValues,
    resolver: zodResolver(placeDressOrderFormSchema)
  })

  const placeDressOrderMutation = useMutation({
    mutationFn: orderService.placeDressOrder,
    onSuccess: (orderId) => {
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: ['vouchers-queries'] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['order'] })
        queryClient.invalidateQueries({ queryKey: ['orders-count'] })
        queryClient.invalidateQueries({ queryKey: ['diary-detail'] })
        queryClient.invalidateQueries({ queryKey: ['measurement-detail'] })
        queryClient.invalidateQueries({ queryKey: ['cart'] })

        router.replace({ pathname: '/payment/[orderId]/qr-code', params: { orderId } })
        setTimeout(() => {
          onSuccess()
          methods.reset()
        }, 500)
      }
    },
    onError: (error) => {
      toast.error(error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG)
    }
  })

  return { methods, placeDressOrderMutation }
}
