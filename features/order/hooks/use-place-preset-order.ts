import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import orderService from '~/services/order.service'
import {
  DeliveryMethod,
  PaymentMethod,
  PaymentType,
  placeOrderPresetFormSchema,
  PlaceOrderPresetFormSchema
} from '../validations'

const defaultValues: PlaceOrderPresetFormSchema = {
  presetId: '',
  addressId: null,
  branchId: null,
  shippingFee: 0,
  voucherDiscountId: null,
  measurementDiaryId: null,
  isOnline: true,
  paymentMethod: PaymentMethod.ONLINE_BANKING,
  paymentType: PaymentType.FULL,
  deliveryMethod: DeliveryMethod.DELIVERY
}

export const usePlacePresetOrder = (onSuccess: () => void) => {
  const router = useRouter()
  const methods = useForm<PlaceOrderPresetFormSchema>({
    defaultValues,
    resolver: zodResolver(placeOrderPresetFormSchema)
  })

  const initForm = useCallback(
    (presetId: string, addressId: string, measurementDiaryId: string) => {
      methods.reset({
        ...defaultValues,
        presetId,
        addressId,
        measurementDiaryId
      })
    },
    [methods]
  )

  const placePresetOrderMutation = useMutation({
    mutationFn: orderService.placePresetOrder,
    onSuccess: (orderId) => {
      if (orderId) {
        router.replace({ pathname: '/payment/[orderId]/qr-code', params: { orderId } })
        setTimeout(() => {
          onSuccess()
          methods.reset()
        }, 500)
      }
    },
    onError: (error) => {
      methods.setError('root', { message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG })
    }
  })

  return { methods, initForm, placePresetOrderMutation }
}
