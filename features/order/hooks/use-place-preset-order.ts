import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import orderService from '~/services/order.service'
import { DeliveryMethod, PaymentMethod, PaymentType } from '~/types/order.type'
import { placePresetOrderFormSchema, PlacePresetOrderFormSchema } from '../validations'

const defaultValues: PlacePresetOrderFormSchema = {
  presets: [],
  addressId: null,
  branchId: null,
  shippingFee: 0,
  voucherDiscountId: null,
  measurementDiaryId: '',
  measurementId: '',
  isOnline: true,
  paymentMethod: PaymentMethod.OnlineBanking,
  paymentType: PaymentType.Full,
  deliveryMethod: DeliveryMethod.Delivery
}

export const usePlacePresetOrder = (onSuccess: () => void) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const methods = useForm<PlacePresetOrderFormSchema>({
    defaultValues,
    resolver: zodResolver(placePresetOrderFormSchema)
  })

  const placePresetOrderMutation = useMutation({
    mutationFn: orderService.placePresetOrder,
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

  return { methods, placePresetOrderMutation }
}
