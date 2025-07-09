import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
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

export const usePlacePresetOrder = () => {
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

  return { methods, initForm }
}
