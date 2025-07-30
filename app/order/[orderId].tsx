import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import OrderStageBar from '~/features/order/components/order-stage-bar'
import { ORDER_STATUS_TYPES, statusStyles } from '~/features/order/constants'
import { useGetOrder } from '~/features/order/hooks/use-get-order'
import { useGetOrderItemMilestones } from '~/features/order/hooks/use-get-order-item-milestones'
import { getOrderItemTypeStyle, getStatusIcon } from '~/features/order/utils'
import { useGetPresetDetail } from '~/features/preset/hooks/use-get-preset-detail'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
import { useAuth } from '~/hooks/use-auth'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useRefreshs } from '~/hooks/use-refresh'
import { styles } from '~/lib/constants/constants'
import { cn, formatVnPhone, getOrderedComponentOptions } from '~/lib/utils'
import {
  DeliveryMethod,
  OrderItemMilestone,
  OrderItemType,
  OrderStatus,
  OrderType,
  PaymentType
} from '~/types/order.type'

interface Config {
  styleConfig: {
    colors: string[]
    textColor: string
    iconColor: string
    shadowColor: string
  }
  title: string
  description: string
  icon: keyof typeof MaterialIcons.glyphMap
}

const getConfig = (orderStatus: OrderStatus | undefined): Config => {
  if (!orderStatus) {
    return {
      styleConfig: {
        colors: ['#ffffff', '#f8fafc', '#e2e8f0'],
        textColor: '#1f2937',
        iconColor: '#6b7280',
        shadowColor: '#e2e8f0'
      },
      title: '',
      description: '',
      icon: 'circle'
    }
  }

  return {
    styleConfig: statusStyles[orderStatus] || {
      colors: ['#ffffff', '#f8fafc', '#e2e8f0'],
      textColor: '#1f2937',
      iconColor: '#6b7280',
      shadowColor: '#e2e8f0'
    },
    title: ORDER_STATUS_TYPES.find((status) => status.value === orderStatus)?.title || '',
    description: ORDER_STATUS_TYPES.find((status) => status.value === orderStatus)?.description || '',
    icon: getStatusIcon(orderStatus)
  }
}

export default function ViewOrderDetailScreen() {
  const router = useRouter()
  const { top, bottom } = useSafeAreaInsets()

  const { user } = useAuth()
  const { orderId } = useLocalSearchParams() as { orderId: string }
  const { isDarkColorScheme } = useColorScheme()

  const {
    data: order,
    isLoading: isLoadingOrder,
    refetch: refetchOrder,
    isFetched: isFetchedOrder
  } = useGetOrder(orderId)
  const {
    data: currentUser,
    isLoading: isLoadingCurrentUser,
    refetch: refetchCurrentUser
  } = useGetProfile(user?.userId)

  const {
    data: milestones,
    isLoading: isLoadingMilestones,
    refetch: refetchMilestones
  } = useGetOrderItemMilestones(order?.items[0]?.id || '')

  const { styleConfig, title, description, icon } = getConfig(order?.status)
  const [isViewMoreOrderDetails, setIsViewMoreOrderDetails] = useState(false)
  const [isViewMoreOrderProgress, setIsViewMoreOrderProgress] = useState(false)
  const [completedMilestones, setCompletedMilestones] = useState<OrderItemMilestone[] | null>(null)
  const [allCompletedMilestones, setAllCompletedMilestones] = useState<OrderItemMilestone[] | null>(null)
  const [currentMilestone, setCurrentMilestone] = useState<OrderItemMilestone | null>(null)

  const {
    data: presetDetail,
    isLoading: isLoadingPresetDetail,
    refetch: refetchPresetDetail
  } = useGetPresetDetail(order?.items[0]?.preset?.id)

  const isLoading = isLoadingOrder || isLoadingCurrentUser || isLoadingPresetDetail || isLoadingMilestones
  const isDisplayOrderProgress = order?.status !== OrderStatus.Cancelled && order?.status !== OrderStatus.Created
  const orderItemTypeSet = [...new Set(order?.items.map((item) => item.itemType))]

  const { refreshControl } = useRefreshs([refetchOrder, refetchCurrentUser, refetchPresetDetail, refetchMilestones])

  useEffect(() => {
    if (milestones && Array.isArray(milestones)) {
      setCurrentMilestone(milestones.filter((m) => m.progress !== 100 || !m.isDone)[0] || milestones[0])
      const completed = milestones.filter((m) => m.progress === 100 || m.isDone)
      setAllCompletedMilestones(completed)
      // Show only the most recent 2 completed milestones by default
      setCompletedMilestones(completed.slice(-2))
    }
  }, [milestones])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  const toggleViewMore = () => {
    setIsViewMoreOrderDetails((prev) => !prev)
  }

  const toggleViewMoreOrderProgress = (value: boolean) => {
    setIsViewMoreOrderProgress(value)
    if (value) {
      // Show all completed milestones
      setCompletedMilestones(allCompletedMilestones)
    } else {
      // Show only the most recent 2 completed milestones
      setCompletedMilestones(allCompletedMilestones ? allCompletedMilestones.slice(-2) : null)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if ((isFetchedOrder && !order) || orderItemTypeSet.length > 1) {
    return <Redirect href='/' />
  }

  return (
    <LinearGradient
      colors={styleConfig.colors as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className='overflow-hidden flex-1'
      style={styles.container}
    >
      <View className='relative z-10 px-4' style={{ paddingTop: Math.max(top + 20, 40) }}>
        <View className='flex-row items-center gap-2 mb-2'>
          <MaterialIcons name={icon} size={20} color={styleConfig.iconColor} />

          <Text style={{ color: styleConfig.textColor }} className='font-inter-semibold flex-1'>
            {title}
          </Text>

          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={20} color={styleConfig.textColor} />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: styleConfig.textColor,
            opacity: 0.85
          }}
          className='text-xs'
        >
          {description}
        </Text>

        <View className='flex-row justify-end space-x-1 mt-2'>
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              className='w-1 h-1 rounded-full'
              style={{
                backgroundColor: styleConfig.iconColor,
                opacity: 0.4 + i * 0.2
              }}
            />
          ))}
        </View>
      </View>

      <Card
        className='flex-1 mx-2 mt-4 rounded-t-3xl rounded-b-none border-transparent'
        style={{
          boxShadow: '0 0px 10px 0px rgba(0, 0, 0, 0.15)',
          paddingBottom: bottom
        }}
      >
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
          <View className='gap-2 p-2'>
            {/* Shipping Information */}
            {orderItemTypeSet[0] !== OrderItemType.DesignRequest ? (
              <Card className='bg-muted/5' style={styles.container}>
                {order?.status === OrderStatus.Delevering ? (
                  <>
                    <View className='p-4'>
                      <Text className='font-inter-medium text-sm mb-2'>Shipping Information</Text>
                    </View>
                    <Separator />
                  </>
                ) : null}

                {/* Delivery Information */}
                <View className='p-3'>
                  <Text className='font-inter-medium text-sm mb-2'>Delivery Information</Text>

                  <View className='flex-row items-start gap-1'>
                    <MaterialCommunityIcons name='map-marker' color={isDarkColorScheme ? 'white' : 'black'} size={20} />
                    <View className='flex-1'>
                      {order?.deliveryMethod === DeliveryMethod.Delivery && order.address ? (
                        <>
                          <Text className='text-sm font-inter-medium' numberOfLines={1}>
                            {currentUser?.fullName}{' '}
                            <Text className='text-muted-foreground text-xs'>
                              {currentUser?.phoneNumber
                                ? formatVnPhone(currentUser?.phoneNumber)
                                : '(missing phone number)'}
                            </Text>
                          </Text>
                          <Text className='text-xs text-muted-foreground' numberOfLines={2}>
                            {order?.address?.street}, {order?.address?.ward}, {order?.address?.district},{' '}
                            {order?.address?.province}
                          </Text>
                        </>
                      ) : null}
                      {order?.deliveryMethod === DeliveryMethod.PickUp && order.branch ? (
                        <>
                          <Text className='text-sm font-inter-medium'>{order.branch?.name}</Text>
                          <Text className='text-xs text-muted-foreground' numberOfLines={1}>
                            {order?.branch?.street}, {order?.branch?.ward}, {order?.branch?.district},{' '}
                            {order?.branch?.province}
                          </Text>
                        </>
                      ) : null}
                    </View>
                  </View>
                </View>
              </Card>
            ) : null}

            <Card className='bg-muted/5' style={styles.container}>
              {/* Order Types */}
              <View className='flex-row items-center gap-2 flex-wrap p-3'>
                {order?.type === OrderType.Warranty ? (
                  <View className='px-3 py-1.5 bg-rose-50 rounded-lg flex-row items-center gap-1.5'>
                    <MaterialIcons name='safety-check' size={14} color='#e11d48' />
                    <Text className='text-xs text-rose-600 font-inter-medium'>Warranty Order</Text>
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
              {/* Order Items */}
              <View className='p-3'>
                {/* Design Request */}
                {orderItemTypeSet[0] === OrderItemType.DesignRequest &&
                order?.items &&
                Array.isArray(order.items) &&
                order.items.length > 0 &&
                order.items[0] &&
                order.items[0].designRequest ? (
                  <View className='flex-row items-start gap-2'>
                    <View className='w-20 h-20 rounded-xl overflow-hidden bg-gray-100'>
                      <Image
                        source={{ uri: order.items[0].designRequest?.images[0] }}
                        className='w-full h-full'
                        resizeMode='cover'
                      />
                    </View>
                    <View className='flex-1 h-20 justify-between'>
                      <View>
                        <Text className='text-sm font-inter-medium'>Design Request</Text>
                        <View className='flex-row items-center justify-between'>
                          <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
                            {order.items[0].designRequest?.description}
                          </Text>
                          <Text className='text-xs text-muted-foreground'>x{order.items[0].quantity}</Text>
                        </View>
                      </View>
                      <View className='items-end'>
                        <Text className='text-xs'>
                          <Text className='text-xs underline'>đ</Text>
                          {order.items[0].price.toLocaleString('vi-VN')}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}

                {orderItemTypeSet[0] === OrderItemType.Preset &&
                order?.items &&
                Array.isArray(order.items) &&
                order.items.length > 0 &&
                order.items[0] &&
                order.items[0].preset ? (
                  <>
                    <View className='flex-row items-start gap-2'>
                      <View className='w-20 h-20 rounded-xl overflow-hidden bg-gray-100'>
                        <Image
                          source={{ uri: order.items[0].preset?.images[0] }}
                          className='w-full h-full'
                          resizeMode='contain'
                        />
                      </View>
                      <View className='flex-1 h-20 justify-between'>
                        <View>
                          <Text className='text-sm font-inter-medium'>{order.items[0].preset?.styleName} Dress</Text>
                          <View className='flex-row items-center justify-between'>
                            <Text className='text-xs text-muted-foreground'>Custom Made-to-Order</Text>
                            <Text className='text-xs text-muted-foreground'>x{order.items[0].quantity}</Text>
                          </View>
                        </View>
                        <View className='items-end'>
                          <Text className='text-xs'>
                            <Text className='text-xs underline'>đ</Text>
                            {order.items[0].price.toLocaleString('vi-VN')}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className='bg-gray-100 rounded-xl p-3 gap-2 mt-2'>
                      {getOrderedComponentOptions(presetDetail?.componentOptions || []).map((option) =>
                        option ? (
                          <View className='flex-row items-center justify-between' key={option.componentName}>
                            <Text className='text-xs text-muted-foreground'>{option.componentName}</Text>
                            <Text className='text-xs font-inter-medium text-foreground'>{option.name}</Text>
                          </View>
                        ) : null
                      )}
                    </View>
                  </>
                ) : null}
              </View>

              <Separator />

              <View className='p-3 flex-row'>
                <Text className='text-sm font-inter-medium flex-1'>
                  Total {order?.items && Array.isArray(order.items) ? order.items.length : 0} Item(s)
                </Text>
                <Text className='font-inter-medium text-sm'>
                  <Text className='underline font-inter-medium text-xs'>đ</Text>
                  {order?.items[0].price && order.items[0].price?.toLocaleString('vi-VN')}
                </Text>
              </View>
            </Card>

            {isDisplayOrderProgress ? (
              <Card className='bg-muted/5' style={styles.container}>
                <Text className='font-inter-medium text-sm px-3 pt-3 pb-1'>Order Progress</Text>
                <OrderStageBar
                  milestones={milestones}
                  currentMilestone={currentMilestone}
                  completedMilestones={completedMilestones}
                />

                {allCompletedMilestones &&
                Array.isArray(allCompletedMilestones) &&
                allCompletedMilestones.length > 2 ? (
                  <View className='mb-2'>
                    {isViewMoreOrderProgress ? (
                      <TouchableOpacity
                        className='flex-row items-center gap-1 justify-center p-2'
                        onPress={() => toggleViewMoreOrderProgress(false)}
                      >
                        <Text className='text-muted-foreground text-xs'>View Less</Text>
                        <Feather name='chevron-up' color={isDarkColorScheme ? 'lightgray' : 'gray'} size={16} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        className='flex-row items-center gap-1 justify-center p-2'
                        onPress={() => toggleViewMoreOrderProgress(true)}
                      >
                        <Text className='text-muted-foreground text-xs'>View More</Text>
                        <Feather name='chevron-down' color={isDarkColorScheme ? 'lightgray' : 'gray'} size={16} />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
              </Card>
            ) : null}

            {/* Order Details */}
            <Card className='bg-muted/5 px-3 pt-3 pb-2' style={styles.container}>
              <Text className='font-inter-medium text-sm mb-2'>Order Details</Text>
              <View className='gap-1'>
                <View className='flex-row items-center gap-2'>
                  <Text className='flex-1 text-xs text-muted-foreground/80'>Order Number</Text>
                  <Text className='text-foreground/80 text-xs'>#{order?.code}</Text>
                </View>

                <View className='flex-row items-center gap-2'>
                  <Text className='flex-1 text-xs text-muted-foreground/80'>Order Placed</Text>
                  <Text className='text-foreground/80 text-xs'>
                    {order?.createdAt ? format(new Date(order.createdAt), "MMM dd, yyyy 'at' hh:mm a") : 'N/A'}
                  </Text>
                </View>

                {isViewMoreOrderDetails && order?.subTotalAmount ? (
                  <View className='flex-row items-center gap-2'>
                    <Text className='flex-1 text-xs text-muted-foreground/80'>Merchandise Subtotal</Text>
                    <Text className='text-foreground/80 text-xs'>
                      đ{order?.subTotalAmount > 0 ? order.subTotalAmount.toLocaleString('vi-VN') : '0'}
                    </Text>
                  </View>
                ) : null}

                {isViewMoreOrderDetails && order?.voucherDiscountId && order?.discountSubtotal ? (
                  <View className='flex-row items-center gap-2'>
                    <Text className='flex-1 text-xs text-muted-foreground/80'>Voucher Discount</Text>
                    <Text className='text-foreground/80 text-xs'>
                      đ{order?.discountSubtotal > 0 ? order.discountSubtotal.toLocaleString('vi-VN') : '0'}
                    </Text>
                  </View>
                ) : null}

                {isViewMoreOrderDetails && order?.paymentType === PaymentType.Deposit && order?.depositSubtotal ? (
                  <View className='flex-row items-center gap-2'>
                    <Text className='flex-1 text-xs text-muted-foreground/80'>Deposit Subtotal</Text>
                    <Text className='text-foreground/80 text-xs'>
                      đ{order?.depositSubtotal > 0 ? order.depositSubtotal.toLocaleString('vi-VN') : '0'}
                    </Text>
                  </View>
                ) : null}

                {isViewMoreOrderDetails && order?.paymentType === PaymentType.Deposit && order?.remainingBalance ? (
                  <View className='flex-row items-center gap-2'>
                    <Text className='flex-1 text-xs text-primary font-inter-medium'>Remaining Balance</Text>
                    <Text className='text-primary font-inter-medium text-xs'>
                      đ{order?.remainingBalance > 0 ? order.remainingBalance.toLocaleString('vi-VN') : '0'}
                    </Text>
                  </View>
                ) : null}

                {isViewMoreOrderDetails && order?.shippingFee ? (
                  <View className='flex-row items-center gap-2'>
                    <Text className='flex-1 text-xs text-muted-foreground/80'>Shipping Fee</Text>
                    <Text className='text-foreground/80 text-xs'>
                      đ{order?.shippingFee > 0 ? order.shippingFee.toLocaleString('vi-VN') : '0'}
                    </Text>
                  </View>
                ) : null}

                <View className='flex-row items-center gap-2'>
                  <Text className='flex-1 text-xs text-muted-foreground/80'>Total</Text>
                  <Text className='text-foreground/80 text-xs'>
                    đ{order?.totalAmount ? order.totalAmount.toLocaleString('vi-VN') : '0'}
                  </Text>
                </View>

                <View className='mt-2'>
                  {isViewMoreOrderDetails ? (
                    <TouchableOpacity
                      className='flex-row items-center gap-1 justify-center p-2'
                      onPress={toggleViewMore}
                    >
                      <Text className='text-muted-foreground text-xs'>View Less</Text>
                      <Feather name='chevron-up' color={isDarkColorScheme ? 'lightgray' : 'gray'} size={16} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className='flex-row items-center gap-1 justify-center p-2'
                      onPress={toggleViewMore}
                    >
                      <Text className='text-muted-foreground text-xs'>View More</Text>
                      <Feather name='chevron-down' color={isDarkColorScheme ? 'lightgray' : 'gray'} size={16} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </Card>
    </LinearGradient>
  )
}
