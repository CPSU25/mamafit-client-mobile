import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { LinearGradient } from 'expo-linear-gradient'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useMemo, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { Card } from '~/components/ui/card'
import { Icon } from '~/components/ui/icon'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useAddToCart } from '~/features/cart/hooks/use-add-to-cart'
import { useGetDesignRequestPreset } from '~/features/design-request/hooks/use-get-design-request-preset'
import { useGetDesignerInfo } from '~/features/design-request/hooks/use-get-designer-info'
import DeliveryInformation from '~/features/order/components/order-detail/delivery-information'
import DesignRequestInformation from '~/features/order/components/order-detail/design-request-information'
import DesignRequestOrderItem from '~/features/order/components/order-detail/design-request-order-item'
import DesignerInformation from '~/features/order/components/order-detail/designer-information'
import DiaryInformation from '~/features/order/components/order-detail/diary-information'
import DressOrderItem from '~/features/order/components/order-detail/dress-order-item'
import OrderDetails from '~/features/order/components/order-detail/order-details'
import OrderDetailsActions from '~/features/order/components/order-detail/order-details-actions'
import PresetOrderItem from '~/features/order/components/order-detail/preset-order-item'
import WarrantyInfoCard from '~/features/order/components/order-detail/warranty-info-card'
import WarrantyPresetOrderItem from '~/features/order/components/order-detail/warranty-preset-order-item'
import { ORDER_STATUS_TYPES, statusStyles } from '~/features/order/constants'
import { useGetOrder } from '~/features/order/hooks/use-get-order'
import { useGetOrderItemsMilestones } from '~/features/order/hooks/use-get-order-items-milestones'
import { getOrderItemTypeStyle, getStatusIcon } from '~/features/order/utils'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
import { useGetWarrantyRequestDetail } from '~/features/warranty-request/hooks/use-get-warranty-request-detail'
import { useAuth } from '~/hooks/use-auth'
import { useGetConfig } from '~/hooks/use-get-config'
import { useRefreshs } from '~/hooks/use-refresh'
import { styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { OrderItemType, OrderStatus, OrderType } from '~/types/order.type'
import { PresetWithComponentOptions } from '~/types/preset.type'

interface StyleConfig {
  colors: [string, string, string]
  textColor: string
  iconColor: string
  shadowColor: string
}

interface OrderConfig {
  styleConfig: StyleConfig
  title: string
  description: string
  icon: keyof typeof MaterialCommunityIcons.glyphMap
}

const getConfig = (orderStatus: OrderStatus | undefined): OrderConfig => {
  if (!orderStatus) {
    return {
      styleConfig: {
        colors: ['#ffffff', '#f8fafc', '#e2e8f0'] as [string, string, string],
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
      colors: ['#ffffff', '#f8fafc', '#e2e8f0'] as [string, string, string],
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
  const scrollViewRef = useRef<ScrollView>(null)

  const { user } = useAuth()
  const { orderId } = useLocalSearchParams() as { orderId: string }

  const { data: config, isLoading: isLoadingConfig, refetch: refetchConfig } = useGetConfig()

  const {
    data: order,
    isLoading: isLoadingOrder,
    refetch: refetchOrder,
    isFetched: isFetchedOrder
  } = useGetOrder(orderId)

  const orderItemTypeSet = useMemo(() => [...new Set(order?.items?.map((item) => item.itemType) || [])], [order?.items])

  const isPresetOrder = useMemo(
    () => Boolean(order && orderItemTypeSet[0] === OrderItemType.Preset),
    [order, orderItemTypeSet]
  )

  const isWarrantyOrder = useMemo(
    () => Boolean(order && orderItemTypeSet[0] === OrderItemType.Warranty),
    [order, orderItemTypeSet]
  )

  const isReadyToBuyOrder = useMemo(
    () => Boolean(order && orderItemTypeSet[0] === OrderItemType.ReadyToBuy),
    [order, orderItemTypeSet]
  )

  const isDesignRequestOrder = useMemo(
    () =>
      Boolean(order && orderItemTypeSet[0] === OrderItemType.DesignRequest && order?.items?.[0]?.designRequest != null),
    [orderItemTypeSet, order]
  )

  const {
    data: warrantyRequestDetail,
    isLoading: isLoadingWarrantyDetail,
    refetch: refetchWarrantyRequestDetail
  } = useGetWarrantyRequestDetail(order?.id ?? '', Boolean(isWarrantyOrder) && isFetchedOrder)

  const {
    data: currentUser,
    isLoading: isLoadingCurrentUser,
    refetch: refetchCurrentUser
  } = useGetProfile(user?.userId, !Boolean(isDesignRequestOrder))

  const {
    data: designRequestDetail,
    isLoading: isLoadingDesignRequestDetail,
    refetch: refetchDesignRequestDetail
  } = useGetDesignRequestPreset(order?.items[0]?.designRequest?.id || '', Boolean(isDesignRequestOrder))

  const { styleConfig, title, description, icon } = useMemo(() => getConfig(order?.status), [order?.status])
  const isSameOrder = useMemo(() => warrantyRequestDetail?.originalOrders?.length === 1, [warrantyRequestDetail])

  const [toggleViewMoreStates, setToggleViewMoreStates] = useState(false)

  const merchandiseTotal = useMemo(() => {
    if (isDesignRequestOrder) {
      return order?.items[0]?.price
    }

    return order?.items?.reduce((acc, item) => acc + (item?.price || 0) * (item.quantity || 1), 0)
  }, [order?.items, isDesignRequestOrder])

  const {
    data: designerInfo,
    isLoading: isLoadingDesignerInfo,
    refetch: refetchDesignerInfo
  } = useGetDesignerInfo(order?.items[0]?.id || '', Boolean(isDesignRequestOrder))

  const isOrderEligibleForProgress = useMemo(() => {
    if (!order?.status) return false
    return ![
      OrderStatus.Created,
      OrderStatus.Confirmed,
      OrderStatus.Cancelled,
      OrderStatus.Completed,
      OrderStatus.Delevering
    ].includes(order.status)
  }, [order?.status])

  const orderItemIds = useMemo(() => {
    return order?.items?.map((item) => item.id).filter(Boolean) || []
  }, [order?.items])

  const {
    milestonesData,
    isLoading: isLoadingMilestones,
    refetch: refetchMilestones
  } = useGetOrderItemsMilestones(orderItemIds, isOrderEligibleForProgress)

  const isLoadingPresetOrder = isLoadingOrder || isLoadingCurrentUser || isLoadingConfig || isLoadingMilestones
  const isLoadingWarrantyOrder = isLoadingOrder || isLoadingCurrentUser || isLoadingConfig || isLoadingWarrantyDetail
  const isLoadingDesignRequestOrder = isLoadingOrder || isLoadingDesignerInfo || isLoadingDesignRequestDetail

  const isLoading = isPresetOrder
    ? isLoadingPresetOrder
    : isWarrantyOrder
      ? isLoadingWarrantyOrder
      : isLoadingDesignRequestOrder

  const { refreshControl: presetRefreshControl } = useRefreshs([
    refetchOrder,
    refetchCurrentUser,
    refetchConfig,
    refetchMilestones
  ])

  const { refreshControl: warrantyRefreshControl } = useRefreshs([
    refetchOrder,
    refetchCurrentUser,
    refetchConfig,
    refetchWarrantyRequestDetail,
    refetchMilestones
  ])

  const { refreshControl: designRefreshControl } = useRefreshs([
    refetchOrder,
    refetchDesignerInfo,
    refetchDesignRequestDetail
  ])

  const { addToCartMutation } = useAddToCart()

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  const handleAddToCart = async (preset: PresetWithComponentOptions) => {
    if (!preset) return

    addToCartMutation.mutate({
      itemId: preset.id,
      type: OrderItemType.Preset,
      quantity: 1
    })
  }

  const toggleViewMore = () => {
    setToggleViewMoreStates((prev) => {
      const newState = !prev

      // Auto-scroll to bottom when expanding to show the extended content
      if (newState) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }, 300) // Delay to allow content to render
      }

      return newState
    })
  }

  if (isLoading) {
    return <Loading />
  }

  if ((isFetchedOrder && !order) || orderItemTypeSet.length > 1) {
    return <Redirect href='/' />
  }

  return (
    <View className='flex-1'>
      <BottomSheetModalProvider>
        <LinearGradient
          colors={styleConfig.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className='overflow-hidden flex-1'
          style={styles.container}
        >
          <View className='relative z-10 px-4' style={{ paddingTop: Math.max(top + 20, 40) }}>
            <TouchableOpacity onPress={handleGoBack} className='mb-6 mr-auto'>
              <Icon as={ArrowLeft} size={24} color={styleConfig.textColor} />
            </TouchableOpacity>

            <View className='flex-row items-center gap-2 mb-1'>
              <MaterialCommunityIcons name={icon} size={20} color={styleConfig.iconColor} />
              <Text style={{ color: styleConfig.textColor }} className='font-inter-semibold flex-1'>
                {title}
              </Text>
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
            className='relative flex-1 mx-2 mt-3.5 rounded-t-3xl rounded-b-none border-transparent'
            style={{
              boxShadow: '0 0px 10px 0px rgba(0, 0, 0, 0.15)',
              paddingBottom: bottom
            }}
          >
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              refreshControl={
                isPresetOrder ? presetRefreshControl : isWarrantyOrder ? warrantyRefreshControl : designRefreshControl
              }
            >
              <View className='flex-1 gap-3 p-2'>
                {/* Warranty Information */}
                {isWarrantyOrder && warrantyRequestDetail ? (
                  <WarrantyInfoCard warrantyRequestDetail={warrantyRequestDetail} isSameOrder={isSameOrder} />
                ) : null}

                {/* Delivery Information */}
                {!isDesignRequestOrder ? (
                  <DeliveryInformation
                    status={order?.status}
                    trackingOrderCode={order?.trackingOrderCode}
                    deliveryMethod={order?.deliveryMethod}
                    address={order?.address}
                    branch={order?.branch}
                    fullName={currentUser?.fullName}
                    phoneNumber={currentUser?.phoneNumber}
                  />
                ) : null}

                {/* Diary Information */}
                {isPresetOrder && order?.measurementDiary ? <DiaryInformation diary={order?.measurementDiary} /> : null}

                {/* Order Summary */}
                <Card className='bg-muted/5' style={styles.container}>
                  <View className='flex-row items-center gap-2 flex-wrap p-3'>
                    {order?.type === OrderType.Warranty ? (
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

                  {isDesignRequestOrder ? (
                    <DesignRequestOrderItem
                      designRequest={order?.items[0]?.designRequest}
                      price={order?.items[0]?.price}
                      quantity={order?.items[0]?.quantity}
                    />
                  ) : null}

                  {isPresetOrder || isWarrantyOrder ? (
                    <>
                      {isWarrantyOrder
                        ? order?.items?.map((orderItem, index) => (
                            <View key={orderItem.id}>
                              <WarrantyPresetOrderItem
                                orderItem={orderItem}
                                preset={orderItem.preset}
                                presetOptions={orderItem.addOnOptions}
                                quantity={orderItem.quantity}
                                orderCreatedAt={order?.createdAt}
                                milestones={milestonesData[orderItem.id]}
                              />
                              {index !== order?.items?.length - 1 ? <Separator /> : null}
                            </View>
                          ))
                        : order?.items?.map((orderItem, index) => (
                            <View key={orderItem.id}>
                              <PresetOrderItem
                                orderItem={orderItem}
                                preset={orderItem.preset}
                                presetOptions={orderItem.addOnOptions}
                                quantity={orderItem.quantity}
                                orderCreatedAt={order?.createdAt}
                                milestones={milestonesData[orderItem.id]}
                              />
                              {index !== order?.items?.length - 1 ? <Separator /> : null}
                            </View>
                          ))}
                    </>
                  ) : null}

                  {isReadyToBuyOrder ? (
                    <>
                      {order?.items?.map((orderItem, index) => (
                        <View key={orderItem.id}>
                          <DressOrderItem
                            orderItem={orderItem}
                            dress={orderItem.maternityDressDetail}
                            dressOptions={orderItem.addOnOptions}
                            quantity={orderItem.quantity}
                          />
                          {index !== order?.items?.length - 1 ? <Separator /> : null}
                        </View>
                      ))}
                    </>
                  ) : null}

                  <Separator />

                  <View className='p-3 flex-row'>
                    <Text className='text-sm font-inter-medium flex-1'>
                      Tổng sản phẩm:{' '}
                      {order?.items?.map((item) => item.quantity).reduce((acc, curr) => acc + curr, 0) || 0}
                    </Text>
                    <Text className='font-inter-medium text-sm'>
                      <Text className='underline font-inter-medium text-xs'>đ</Text>
                      {merchandiseTotal ? merchandiseTotal.toLocaleString('vi-VN') : '0'}
                    </Text>
                  </View>
                </Card>

                {/* Designer Information */}
                {isDesignRequestOrder ? <DesignerInformation designerInfo={designerInfo} /> : null}

                {/* Design Request Information */}
                {isDesignRequestOrder && designRequestDetail ? (
                  <DesignRequestInformation
                    designRequestDetail={designRequestDetail}
                    handleCheckOut={handleAddToCart}
                  />
                ) : null}

                {/* Order Details */}
                <OrderDetails
                  depositRate={config?.depositRate}
                  depositSubtotal={order?.depositSubtotal}
                  paymentType={order?.paymentType}
                  remainingBalance={order?.remainingBalance}
                  shippingFee={order?.shippingFee}
                  subTotalAmount={order?.subTotalAmount}
                  serviceAmount={order?.serviceAmount}
                  voucherDiscountId={order?.voucherDiscountId}
                  discountSubtotal={order?.discountSubtotal}
                  isViewMoreOrderDetails={toggleViewMoreStates}
                  orderCode={order?.code}
                  orderReceivedAt={order?.receivedAt}
                  orderPlacedAt={order?.createdAt}
                  toggleViewMore={toggleViewMore}
                  totalAmount={order?.totalAmount}
                />
              </View>
            </ScrollView>

            {order?.status === OrderStatus.Created ||
            order?.status === OrderStatus.Completed ||
            order?.status === OrderStatus.Delevering ||
            order?.status === OrderStatus.AwaitingPaidWarranty ||
            order?.status === OrderStatus.AwaitingPaidRest ? (
              <OrderDetailsActions orderId={order?.id} status={order?.status} bottom={bottom} orderCode={order?.code} />
            ) : null}
          </Card>
        </LinearGradient>
      </BottomSheetModalProvider>
    </View>
  )
}
