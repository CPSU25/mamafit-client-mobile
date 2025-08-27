import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { XCircle } from 'lucide-react-native'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Icon } from '~/components/ui/icon'
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
  orderId: string
  orderCode: string
}

export default function OrderDetailsActions({ status, bottom, orderId, orderCode }: OrderDetailsActionsProps) {
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
      className='absolute bottom-0 bg-background left-0 right-0 px-2 pt-3'
      style={{ paddingBottom: bottom, boxShadow: '0 -2px 6px -1px rgba(0, 0, 0, 0.1)' }}
    >
      {status === OrderStatus.Completed ? (
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/order/[orderId]/rate', params: { orderId } })}
          className='flex-row items-center gap-2 flex-1 justify-center p-2 rounded-xl border border-indigo-100 bg-indigo-50'
        >
          <MaterialCommunityIcons name='star-circle' size={16} color='#4f46e5' />
          <Text className='font-inter-medium text-sm text-indigo-600'>Đánh giá</Text>
        </TouchableOpacity>
      ) : null}

      {status === OrderStatus.Created || status === OrderStatus.AwaitingPaidWarranty ? (
        <View className='flex-row items-center gap-2'>
          <View className='flex-1'>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <TouchableOpacity className='flex-1 flex-row items-center gap-2 justify-center p-2 rounded-xl border border-rose-100 bg-rose-50'>
                  <MaterialCommunityIcons name='cancel' size={16} color='#e11d48' />
                  <Text className='font-inter-medium text-sm text-rose-600'>Hủy đơn</Text>
                </TouchableOpacity>
              </DialogTrigger>

              <DialogContent
                style={{
                  marginBottom: keyboardHeight / 2.5,
                  width: width - 30,
                  padding: 16
                }}
              >
                <FormProvider {...methods}>
                  <View className='gap-2'>
                    <Text className='font-inter-semibold text-xl'>Hủy đơn hàng #{orderCode}</Text>
                    <Text className='text-sm text-muted-foreground'>Bạn có chắc chắn muốn hủy đơn hàng này không?</Text>
                  </View>

                  <CancelOrderForm />

                  <TouchableOpacity
                    className='p-3 rounded-xl flex-row items-center justify-center gap-2 bg-rose-50'
                    onPress={methods.handleSubmit(onSubmit)}
                    disabled={cancelOrderMutation.isPending}
                  >
                    <Icon as={XCircle} size={16} color='#e11d48' />
                    <Text className='text-sm text-rose-600 font-inter-medium'>
                      {cancelOrderMutation.isPending ? 'Đang hủy...' : 'Hủy đơn'}
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
            <Text className='text-sm font-inter-medium text-emerald-600'>Trả tiền</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {status === OrderStatus.AwaitingPaidRest ? (
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
          <Text className='text-sm font-inter-medium text-emerald-600'>Trả tiền</Text>
        </TouchableOpacity>
      ) : null}

      {status === OrderStatus.Delevering ? (
        <TouchableOpacity
          className='flex-row items-center gap-2 flex-1 justify-center px-4 py-2 rounded-xl border border-primary/10 bg-primary/5'
          onPress={() => receiveOrder(orderId)}
          disabled={isReceivingOrder}
        >
          <MaterialCommunityIcons name='package' size={16} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium text-sm text-primary'>
            {isReceivingOrder ? 'Đang nhận...' : 'Nhận hàng'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}
