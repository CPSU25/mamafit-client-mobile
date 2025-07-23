import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import orderService from '~/services/order.service'
import {
  DeliveryMethod,
  PaymentMethod,
  PaymentType,
  placePresetOrderFormSchema,
  PlacePresetOrderFormSchema
} from '../validations'

const defaultValues: PlacePresetOrderFormSchema = {
  presetId: '',
  addressId: null,
  branchId: null,
  shippingFee: 0,
  voucherDiscountId: null,
  measurementDiaryId: '',
  options: [],
  isOnline: true,
  paymentMethod: PaymentMethod.ONLINE_BANKING,
  paymentType: PaymentType.FULL,
  deliveryMethod: DeliveryMethod.DELIVERY
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
