import { Feather, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { Image, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useKeyboardOffset } from '~/hooks/use-keyboard-offset'
import { cn } from '~/lib/utils'
import { Order, OrderItem, OrderItemType, OrderStatus, OrderType } from '~/types/order.type'
import { useCancelOrder } from '../../hooks/use-cancel-order'
import { useReceiveOrder } from '../../hooks/use-receive-order'
import { getOrderItemTypeStyle } from '../../utils'
import { CancelOrderFormSchema } from '../../validations'
import CancelOrderForm from './cancel-order-form'

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { width } = useWindowDimensions()
  const keyboardHeight = useKeyboardOffset()

  const { methods, cancelOrderMutation } = useCancelOrder()
  const { mutate, isPending } = useReceiveOrder()

  const orderItemTypeSet = [...new Set(order.items.map((item) => item.itemType))]

  const totalPrice = order.subTotalAmount - (order.discountSubtotal || 0)

  const isDisplayPayButton = order.status === OrderStatus.Created || order.status === OrderStatus.AwaitingPaidRest
  const isDisplayRateButton = order.status === OrderStatus.Completed
  const isDisplayWarrantyButton = order.status === OrderStatus.Completed
  const isDisplayCancelButton = order.status === OrderStatus.Created
  const isHiddenViewDetailsButton = order.status === OrderStatus.Created || order.status === OrderStatus.Completed
  const isDisplayReceiveButton = order.status === OrderStatus.Delevering

  const onSubmit: SubmitHandler<CancelOrderFormSchema> = (data) => {
    if (!order?.id) return

    console.log(data)

    cancelOrderMutation.mutate({ orderId: order.id, canceledReason: data.canceledReason })
  }

  if (orderItemTypeSet.length > 1) {
    return <Text>Invalid Order</Text>
  }

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/order/[orderId]',
          params: {
            orderId: order.id
          }
        })
      }
    >
      <Card className='overflow-hidden'>
        {/* Tag Section */}
        <View className='p-2'>
          <View className='flex-row items-center gap-2 flex-wrap'>
            {order.type === OrderType.Warranty ? (
              <View className='px-3 py-1.5 bg-pink-50 rounded-xl flex-row items-center gap-1.5'>
                <MaterialIcons name='safety-check' size={14} color='#db2777' />
                <Text className='text-xs text-pink-600 font-inter-medium'>Warranty Order</Text>
              </View>
            ) : null}

            {orderItemTypeSet.map((type, index) => (
              <View
                key={index}
                className={cn(
                  'px-3 py-1.5 rounded-xl flex-row items-center gap-1.5',
                  getOrderItemTypeStyle(type).tagColor
                )}
              >
                <MaterialIcons
                  name={getOrderItemTypeStyle(type).icon}
                  size={14}
                  color={getOrderItemTypeStyle(type).iconColor}
                />
                <Text className={cn('text-xs font-inter-medium', getOrderItemTypeStyle(type).textColor)}>
                  {getOrderItemTypeStyle(type).text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Separator />

        {/* Items Section */}
        <View className='p-2 gap-3'>
          {order.items.map((item, index) => {
            let component = null
            if ((item.itemType === OrderItemType.Preset || item.itemType === OrderItemType.Warranty) && item.preset) {
              component = <PresetOrderItem key={item.id} item={item} />
            }
            if (item.itemType === OrderItemType.DesignRequest && item.designRequest) {
              component = <DesignRequestOrderItem key={item.id} item={item} />
            }
            if (item.itemType === OrderItemType.ReadyToBuy && item.maternityDressDetail) {
              component = <ReadyToBuyOrderItem key={item.id} item={item} />
            }

            if (component) {
              return (
                <View key={item.id}>
                  {component}
                  {index < order.items.length - 1 && <View className='h-px bg-gray-100 mt-3' />}
                </View>
              )
            }
            return null
          })}
        </View>

        <View className='m-2 items-end'>
          <Text className='text-xs'>
            Total {order.items?.length} Item{order.items?.length > 1 ? 's' : ''}:{' '}
            <Text className='text-sm font-inter-semibold'>
              <Text className='text-xs font-inter-semibold underline'>đ</Text>
              {totalPrice.toLocaleString('vi-VN')}
            </Text>
          </Text>
        </View>

        <View className='px-2 pb-2 flex-row justify-end gap-2'>
          {!isHiddenViewDetailsButton ? (
            <TouchableOpacity
              className='px-4 py-2 border border-border rounded-xl items-center'
              onPress={() =>
                router.push({
                  pathname: '/order/[orderId]',
                  params: {
                    orderId: order.id
                  }
                })
              }
            >
              <Text className='text-sm font-inter-medium'>View Details</Text>
            </TouchableOpacity>
          ) : null}

          {isDisplayReceiveButton ? (
            <TouchableOpacity
              className='px-4 py-2 border border-indigo-50 rounded-xl items-center bg-indigo-100'
              onPress={() => mutate(order?.id)}
              disabled={isPending}
            >
              <Text className='text-sm font-inter-medium text-indigo-600'>{isPending ? 'Loading...' : 'Receive'}</Text>
            </TouchableOpacity>
          ) : null}

          {isDisplayCancelButton ? (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <TouchableOpacity className='px-4 py-2 bg-rose-50 rounded-xl items-center border border-rose-100'>
                  <Text className='text-sm font-inter-medium text-rose-600'>
                    {cancelOrderMutation.isPending ? 'Canceling...' : 'Cancel Order'}
                  </Text>
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
                    <Text className='font-inter-semibold text-xl'>Cancel Order #{order?.code}</Text>
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
          ) : null}

          {isDisplayPayButton ? (
            <TouchableOpacity
              className='px-4 py-2 bg-emerald-50 rounded-xl items-center border border-emerald-100'
              onPress={() =>
                router.push({
                  pathname: '/payment/[orderId]/qr-code',
                  params: {
                    orderId: order.id
                  }
                })
              }
            >
              <Text className='text-sm font-inter-medium text-emerald-600'>Pay Now</Text>
            </TouchableOpacity>
          ) : null}

          {isDisplayWarrantyButton ? (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/order/warranty/[orderItemId]',
                  params: { orderItemId: order?.items[0]?.parentOrderItemId ?? order?.items[0]?.id }
                })
              }
              className='px-4 py-2 bg-amber-50 rounded-xl items-center border border-amber-100'
            >
              <Text className='text-sm font-inter-medium text-amber-600'>Demand Warranty</Text>
            </TouchableOpacity>
          ) : null}

          {isDisplayRateButton ? (
            <TouchableOpacity className='px-4 py-2 bg-indigo-50 rounded-xl items-center border border-indigo-100'>
              <Text className='text-sm font-inter-medium text-indigo-600'>Rate</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const PresetOrderItem = ({ item }: { item: OrderItem }) => {
  const { preset, quantity, price } = item
  const itemPrice = price * quantity

  return (
    <View className='flex-row items-start gap-3'>
      <View className='w-20 h-20 rounded-xl overflow-hidden bg-gray-50'>
        <Image source={{ uri: preset?.images[0] }} className='w-full h-full' resizeMode='contain' />
      </View>
      <View className='flex-1 h-20 justify-between'>
        <View>
          <Text className='text-sm font-inter-medium'>{preset?.styleName || 'Custom'} Dress</Text>
          <View className='flex-row items-center justify-between'>
            <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
              {preset?.styleName ? 'Made-to-Order Custom Style' : 'Tailored Just for You'}
            </Text>
            <Text className='text-xs text-muted-foreground'>x{quantity}</Text>
          </View>
        </View>
        <View className='items-end'>
          <Text className='text-xs'>
            <Text className='text-xs underline'>đ</Text>
            {itemPrice.toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>
    </View>
  )
}

const DesignRequestOrderItem = ({ item }: { item: OrderItem }) => {
  const { designRequest, quantity, price } = item
  const itemPrice = price * quantity

  return (
    <View className='flex-row items-start gap-3'>
      <View className='w-20 h-20 rounded-xl overflow-hidden bg-gray-50'>
        <Image source={{ uri: designRequest?.images[0] }} className='w-full h-full' resizeMode='cover' />
      </View>
      <View className='flex-1 h-20 justify-between'>
        <View>
          <Text className='text-sm font-inter-medium'>Design Request</Text>
          <View className='flex-row items-center justify-between'>
            <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
              {designRequest?.description}
            </Text>
            <Text className='text-xs text-muted-foreground'>x{quantity}</Text>
          </View>
        </View>
        <View className='items-end'>
          <Text className='text-xs'>
            <Text className='text-xs underline'>đ</Text>
            {itemPrice.toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>
    </View>
  )
}

const ReadyToBuyOrderItem = ({ item }: { item: OrderItem }) => {
  return <Text>To Be Implemented</Text>
}
