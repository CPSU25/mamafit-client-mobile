import { Feather, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { Image, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import { useGetFeedbackStatus } from '~/features/feedback/hooks/use-get-feedback-status'
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
  const { data: feedbackStatus, isLoading: isLoadingFeedbackStatus } = useGetFeedbackStatus(order.id)

  const orderItemTypeSet = [...new Set(order.items.map((item) => item.itemType))]

  const totalPrice = order.subTotalAmount - (order.discountSubtotal || 0)

  const isDisplayPayButton =
    order.status === OrderStatus.Created ||
    order.status === OrderStatus.AwaitingPaidRest ||
    order.status === OrderStatus.AwaitingPaidWarranty
  const isDisplayRateButton = order.status === OrderStatus.Completed
  const isDisplayCancelButton = order.status === OrderStatus.Created
  const isDisplayViewDetailsButton = order.status !== OrderStatus.Created
  const isDisplayReceiveButton =
    order.status === OrderStatus.Delevering && orderItemTypeSet[0] !== OrderItemType.DesignRequest

  const onSubmit: SubmitHandler<CancelOrderFormSchema> = (data) => {
    if (!order?.id) return

    console.log(data)

    cancelOrderMutation.mutate({ orderId: order.id, canceledReason: data.canceledReason })
  }

  if (orderItemTypeSet.length > 1) {
    return <Text>Invalid Order</Text>
  }

  return isLoadingFeedbackStatus ? (
    <Skeleton className='h-72 rounded-2xl bg-background' />
  ) : (
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
        <View className='flex-row items-center gap-2 flex-wrap p-2'>
          {order.type === OrderType.Warranty ? (
            <View className='px-3 py-1.5 bg-blue-50 rounded-lg flex-row items-center gap-1.5'>
              <MaterialIcons name='safety-check' size={14} color='#2563eb' />
              <Text className='text-xs text-blue-600 font-inter-medium'>Bảo hành</Text>
            </View>
          ) : null}

          {orderItemTypeSet.map((type, index) => (
            <View
              key={index}
              className={cn(
                'px-3 py-1.5 rounded-lg flex-row items-center gap-1.5',
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

        <Separator />

        {/* Items Section */}
        <View>
          {order.items.map((item) => {
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
                <View className='pt-2' key={item.id}>
                  {component}
                </View>
              )
            }
            return null
          })}
        </View>

        <View className='mx-2 mt-5 mb-1 items-end'>
          <Text className='text-xs'>
            Tổng {order.items?.map((item) => item.quantity).reduce((acc, curr) => acc + curr, 0)} sản phẩm:{' '}
            <Text className='text-sm font-inter-semibold'>
              <Text className='text-xs font-inter-semibold underline'>đ</Text>
              {totalPrice.toLocaleString('vi-VN')}
            </Text>
          </Text>
        </View>

        <View className='p-2 flex-row justify-end gap-2'>
          {isDisplayViewDetailsButton ? (
            <TouchableOpacity
              className='px-6 py-2 border border-border rounded-xl items-center'
              onPress={() =>
                router.push({
                  pathname: '/order/[orderId]',
                  params: {
                    orderId: order.id
                  }
                })
              }
            >
              <Text className='text-sm font-inter-medium'>Xem chi tiết</Text>
            </TouchableOpacity>
          ) : null}

          {isDisplayReceiveButton ? (
            <TouchableOpacity
              className='px-6 py-2 border border-border rounded-xl items-center'
              onPress={() => mutate(order?.id)}
              disabled={isPending}
            >
              <Text className='text-sm font-inter-medium'>{isPending ? 'Đang Nhận...' : 'Nhận hàng'}</Text>
            </TouchableOpacity>
          ) : null}

          {isDisplayCancelButton ? (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <TouchableOpacity className='px-6 py-2 rounded-xl items-center border border-border'>
                  <Text className='text-sm font-inter-medium text-rose-600'>
                    {cancelOrderMutation.isPending ? 'Đang hủy...' : 'Hủy đơn'}
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
                    <Text className='font-inter-semibold text-xl'>Hủy đơn #{order?.code}</Text>
                    <Text className='text-sm text-muted-foreground'>
                      Hành động này không thể hoàn tác. Vui lòng xác nhận nếu bạn muốn hủy đơn hàng.
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
                      {cancelOrderMutation.isPending ? 'Đang hủy...' : 'Hủy đơn'}
                    </Text>
                  </TouchableOpacity>
                </FormProvider>
              </DialogContent>
            </Dialog>
          ) : null}

          {isDisplayPayButton ? (
            <TouchableOpacity
              className='px-6 py-2 rounded-xl items-center border border-border'
              onPress={() =>
                router.push({
                  pathname: '/payment/[orderId]/qr-code',
                  params: {
                    orderId: order.id
                  }
                })
              }
            >
              <Text className='text-sm font-inter-medium'>Trả tiền</Text>
            </TouchableOpacity>
          ) : null}

          {isDisplayRateButton && !feedbackStatus ? (
            <TouchableOpacity
              className='px-6 py-2 rounded-xl items-center border border-border'
              onPress={() => router.push({ pathname: '/order/[orderId]/rate', params: { orderId: order.id } })}
            >
              <Text className='text-sm font-inter-medium'>Đánh giá</Text>
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
    <View className='flex-row items-start gap-2 px-2'>
      <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
        <Image source={{ uri: preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
      </View>
      <View className='flex-1 h-20 justify-between'>
        <View>
          <Text className='text-sm font-inter-medium' numberOfLines={1}>
            {preset?.name || 'Váy bầu tùy chỉnh'}
          </Text>

          <View className='flex-row items-center gap-2'>
            <Text className='text-xs text-muted-foreground flex-1'>{preset?.sku ? `SKU: ${preset?.sku}` : ''}</Text>
            <Text className='text-xs text-muted-foreground'>x{quantity || 1}</Text>
          </View>
        </View>
        <View className='items-end'>
          <Text className='text-xs'>
            <Text className='text-xs underline'>đ</Text>
            {itemPrice?.toLocaleString('vi-VN') || '0'}
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
    <View className='flex-row items-start gap-3 px-2'>
      <View className='w-20 h-20 rounded-xl overflow-hidden bg-gray-50'>
        <Image source={{ uri: designRequest?.images[0] }} className='w-full h-full' resizeMode='cover' />
      </View>
      <View className='flex-1 h-20 justify-between'>
        <View>
          <Text className='text-sm font-inter-medium'>Yêu Cầu Thiết Kế</Text>
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
  const { maternityDressDetail, quantity, price } = item
  const itemPrice = price * quantity

  return (
    <View className='flex-row items-center gap-2 px-2'>
      <View className='w-20 h-20 overflow-hidden relative rounded-xl'>
        <Image
          source={{ uri: maternityDressDetail?.image[0] }}
          style={{
            width: '100%',
            height: '180%',
            borderRadius: 12,
            position: 'absolute',
            top: 0,
            left: 0
          }}
          resizeMode='cover'
        />
      </View>

      <View className='flex-1 h-20 justify-between'>
        <View>
          <Text className='native:text-sm font-inter-medium' numberOfLines={1}>
            {maternityDressDetail?.name || 'Không có tên'}
          </Text>
          <View className='flex-row items-center justify-between'>
            <Text className='native:text-xs text-muted-foreground'>
              Phân loại: {maternityDressDetail?.color} - {maternityDressDetail?.size}
            </Text>
            <Text className='native:text-xs text-muted-foreground'>x{quantity || 1}</Text>
          </View>
        </View>
        <View className='items-end'>
          <Text className='native:text-xs'>
            <Text className='native:text-xs underline'>đ</Text>
            {itemPrice?.toLocaleString('vi-VN') || '0'}
          </Text>
        </View>
      </View>
    </View>
  )
}
