import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Text } from '~/components/ui/text'
import { useKeyboardOffset } from '~/hooks/use-keyboard-offset'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { OrderStatus } from '~/types/order.type'
import { useCancelOrder } from '../../hooks/use-cancel-order'
import { useReceiveOrder } from '../../hooks/use-receive-order'
import { CancelOrderFormSchema } from '../../validations'
import CancelOrderForm from './cancel-order-form'

interface OrderDetailsActionsProps {
  status: OrderStatus
  bottom: number
  parentOrderItemId: string
  orderId: string
  orderCode: string
}

export default function OrderDetailsActions({
  status,
  bottom,
  parentOrderItemId,
  orderId,
  orderCode
}: OrderDetailsActionsProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)

  const { mutate: receiveOrder, isPending: isReceivingOrder } = useReceiveOrder()
  const { methods, cancelOrderMutation } = useCancelOrder()

  const { width } = useWindowDimensions()
  const keyboardHeight = useKeyboardOffset()

  const onSubmit: SubmitHandler<CancelOrderFormSchema> = (data) => {
    if (!orderId) return

    console.log(data)

    cancelOrderMutation.mutate({ orderId, canceledReason: data.canceledReason })
  }

  return (
    <View
      className='absolute bottom-0 bg-background left-0 right-0 px-2 pt-2'
      style={{ paddingBottom: bottom, boxShadow: '0 -2px 6px -1px rgba(0, 0, 0, 0.1)' }}
    >
      {status === OrderStatus.Completed ? (
        <View className='flex-row items-center gap-2'>
          <TouchableOpacity
            className='flex-row items-center gap-2 flex-1 justify-center p-2 rounded-xl border border-amber-100 bg-amber-50'
            onPress={() =>
              router.push({
                pathname: '/order/warranty/[orderItemId]/create',
                params: { orderItemId: parentOrderItemId }
              })
            }
          >
            <MaterialCommunityIcons name='shield-plus' size={16} color='#d97706' />
            <Text className='font-inter-medium text-sm text-amber-600'>Demand Warranty</Text>
          </TouchableOpacity>
          <TouchableOpacity className='flex-row items-center gap-2 flex-1 justify-center p-2 rounded-xl border border-indigo-100 bg-indigo-50'>
            <MaterialCommunityIcons name='star-circle' size={16} color='#4f46e5' />
            <Text className='font-inter-medium text-sm text-indigo-600'>Rate</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {status === OrderStatus.Created ? (
        <View className='flex-row items-center gap-2'>
          <View className='flex-1'>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <TouchableOpacity className='flex-1 flex-row items-center gap-2 justify-center p-2 rounded-xl border border-rose-100 bg-rose-50'>
                  <MaterialCommunityIcons name='cancel' size={16} color='#e11d48' />
                  <Text className='font-inter-medium text-sm text-rose-600'>Cancel Order</Text>
                </TouchableOpacity>
              </DialogTrigger>

              <DialogContent
                displayCloseButton={false}
                style={{
                  marginBottom: keyboardHeight / 2.5,
                  width: width - 30,
                  padding: 16
                }}
              >
                <FormProvider {...methods}>
                  <View className='gap-2'>
                    <Text className='font-inter-semibold text-xl'>Cancel Order #{orderCode}</Text>
                    <Text className='text-sm text-muted-foreground'>
                      This action cannot be undone. Please confirm if you want to cancel the order .
                    </Text>
                  </View>

                  <CancelOrderForm />

                  <TouchableOpacity
                    className='p-3 rounded-xl flex-row items-center justify-center gap-2 bg-rose-50'
                    onPress={methods.handleSubmit(onSubmit)}
                    disabled={cancelOrderMutation.isPending}
                  >
                    <Feather name='x' size={16} color='#e11d48' />
                    <Text className='text-sm text-rose-600 font-inter-medium'>
                      {cancelOrderMutation.isPending ? 'Canceling...' : 'Cancel Order'}
                    </Text>
                  </TouchableOpacity>
                </FormProvider>
              </DialogContent>
            </Dialog>
          </View>
          <TouchableOpacity
            className='flex-1 flex-row items-center gap-2 justify-center p-2 rounded-xl border border-emerald-100 bg-emerald-50'
            onPress={() =>
              router.push({
                pathname: '/payment/[orderId]/qr-code',
                params: {
                  orderId
                }
              })
            }
          >
            <MaterialCommunityIcons name='credit-card' size={16} color='#059669' />
            <Text className='text-sm font-inter-medium text-emerald-600'>Pay Now</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {status === OrderStatus.Delevering ? (
        <TouchableOpacity
          className='flex-row items-center gap-2 flex-1 justify-center px-4 py-2 rounded-xl border border-primary/10 bg-primary/5'
          onPress={() => receiveOrder(orderId)}
          disabled={isReceivingOrder}
        >
          <MaterialCommunityIcons name='package' size={16} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium text-sm text-primary'>
            {isReceivingOrder ? 'Receiving...' : 'Receive Order'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}
