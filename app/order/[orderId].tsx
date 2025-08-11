import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { useGetDesignRequestPreset } from '~/features/design-request/hooks/use-get-design-request-preset'
import { useGetDesignerInfo } from '~/features/design-request/hooks/use-get-designer-info'
import DeliveryInformation from '~/features/order/components/order-detail/delivery-information'
import DesignRequestInformation from '~/features/order/components/order-detail/design-request-information'
import DesignRequestOrderItem from '~/features/order/components/order-detail/design-request-order-item'
import DesignerInformation from '~/features/order/components/order-detail/designer-information'
import DiaryInformation from '~/features/order/components/order-detail/diary-information'
import OrderDetails from '~/features/order/components/order-detail/order-details'
import OrderDetailsActions from '~/features/order/components/order-detail/order-details-actions'
import OrderProgress from '~/features/order/components/order-detail/order-progress'
import PresetOrderItem from '~/features/order/components/order-detail/preset-order-item'
import WarrantyInfoCard from '~/features/order/components/order-detail/warranty-info-card'
import WarrantyPresetOrderItem from '~/features/order/components/order-detail/warranty-preset-order-item'
import { ORDER_STATUS_TYPES, statusStyles } from '~/features/order/constants'
import { useGetOrder } from '~/features/order/hooks/use-get-order'
import { useGetOrderItemMilestones } from '~/features/order/hooks/use-get-order-item-milestones'
import { getOrderItemTypeStyle, getStatusIcon } from '~/features/order/utils'
import { useGetPresetDetail } from '~/features/preset/hooks/use-get-preset-detail'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
import { useGetWarrantyRequestDetail } from '~/features/warranty-request/hooks/use-get-warranty-request-detail'
import { useAuth } from '~/hooks/use-auth'
import { useGetConfig } from '~/hooks/use-get-config'
import { useRefreshs } from '~/hooks/use-refresh'
import { styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { OrderItemMilestone, OrderItemType, OrderStatus, OrderType } from '~/types/order.type'
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

  const isPresetAndWarrantyOrder =
    orderItemTypeSet[0] === OrderItemType.Preset || orderItemTypeSet[0] === OrderItemType.Warranty

  const isPresetOrder = useMemo(() => Boolean(order && isPresetAndWarrantyOrder), [isPresetAndWarrantyOrder, order])

  const isDesignRequestOrder = useMemo(
    () =>
      Boolean(order && orderItemTypeSet[0] === OrderItemType.DesignRequest && order?.items?.[0]?.designRequest != null),
    [orderItemTypeSet, order]
  )

  const isDisplayOrderProgress = useMemo(
    () =>
      isPresetAndWarrantyOrder &&
      order?.status !== OrderStatus.Created &&
      order?.status !== OrderStatus.Confirmed &&
      order?.status !== OrderStatus.Cancelled &&
      order?.status !== OrderStatus.Completed,
    [isPresetAndWarrantyOrder, order?.status]
  )
  const isWarrantyOrder = useMemo(() => order?.type === OrderType.Warranty, [order?.type])

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
    data: milestones,
    isLoading: isLoadingMilestones,
    refetch: refetchMilestones
  } = useGetOrderItemMilestones(order?.items[0]?.id || '', Boolean(isPresetOrder) && isDisplayOrderProgress)

  const {
    data: designRequestDetail,
    isLoading: isLoadingDesignRequestDetail,
    refetch: refetchDesignRequestDetail
  } = useGetDesignRequestPreset(order?.items[0]?.designRequest?.id || '', Boolean(isDesignRequestOrder))

  const { styleConfig, title, description, icon } = useMemo(() => getConfig(order?.status), [order?.status])
  const isSameOrder = useMemo(() => warrantyRequestDetail?.originalOrders?.length === 1, [warrantyRequestDetail])

  // Global toggle view more state - includes orderDetails, orderProgress, and item-{orderItemId}
  const [toggleViewMoreStates, setToggleViewMoreStates] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {
      orderDetails: false,
      orderProgress: false
    }

    // Initialize toggle states for each order item
    if (order?.items) {
      order.items.forEach((item) => {
        initialState[`item-${item.id}`] = false
      })
    }

    return initialState
  })

  const [completedMilestones, setCompletedMilestones] = useState<OrderItemMilestone[] | null>(null)
  const [allCompletedMilestones, setAllCompletedMilestones] = useState<OrderItemMilestone[] | null>(null)
  const [currentMilestone, setCurrentMilestone] = useState<OrderItemMilestone | null>(null)

  const merchandiseTotal = useMemo(() => {
    if (isDesignRequestOrder) {
      return order?.items[0]?.price
    }

    return order?.items?.reduce((acc, item) => acc + (item?.price || 0) * (item.quantity || 1), 0)
  }, [order?.items, isDesignRequestOrder])

  const {
    data: presetDetail,
    isLoading: isLoadingPresetDetail,
    refetch: refetchPresetDetail
  } = useGetPresetDetail(order?.items[0]?.preset?.id, Boolean(isPresetOrder))

  const {
    data: designerInfo,
    isLoading: isLoadingDesignerInfo,
    refetch: refetchDesignerInfo
  } = useGetDesignerInfo(order?.items[0]?.id || '', Boolean(isDesignRequestOrder))

  const isLoading =
    isLoadingOrder ||
    isLoadingCurrentUser ||
    isLoadingPresetDetail ||
    isLoadingMilestones ||
    isLoadingDesignerInfo ||
    isLoadingConfig ||
    isLoadingDesignRequestDetail ||
    isLoadingWarrantyDetail

  const { refreshControl } = useRefreshs([
    refetchOrder,
    refetchCurrentUser,
    refetchPresetDetail,
    refetchMilestones,
    refetchDesignerInfo,
    refetchConfig,
    refetchDesignRequestDetail,
    refetchWarrantyRequestDetail
  ])

  // Initialize item toggle states when order data becomes available
  useEffect(() => {
    if (order?.items) {
      setToggleViewMoreStates((prev) => {
        const newState = { ...prev }
        order.items.forEach((item) => {
          if (!(`item-${item.id}` in newState)) {
            newState[`item-${item.id}`] = false
          }
        })
        return newState
      })
    }
  }, [order?.items])

  useEffect(() => {
    if (!milestones?.length) return

    const currentMilestone = milestones.find((m) => m.progress !== 100 && !m.isDone)
    setCurrentMilestone(currentMilestone || null)

    const placedProgress: OrderItemMilestone = {
      milestone: { id: '1', name: 'Order Placed' },
      progress: 100,
      isDone: true,
      currentTask: {
        id: '1',
        name: 'Order Placed'
      }
    }

    const completedMilestones = [placedProgress, ...milestones.filter((m) => m.progress === 100 || m.isDone)]

    setAllCompletedMilestones(completedMilestones)
    setCompletedMilestones(completedMilestones.slice(-2))
  }, [milestones])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  const handleCheckOut = async (preset: PresetWithComponentOptions) => {
    if (!preset) return

    try {
      await AsyncStorage.setItem(
        'order-items',
        JSON.stringify({
          type: OrderItemType.Preset,
          items: {
            [preset.id]: {
              presetId: preset.id,
              quantity: 1,
              options: []
            }
          }
        })
      )
    } catch (error) {
      console.log(error)
    }
  }

  const toggleViewMore = () => {
    setToggleViewMoreStates((prev) => {
      const newState = { ...prev, orderDetails: !prev.orderDetails }

      // Auto-scroll to bottom when expanding to show the extended content
      if (newState.orderDetails) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }, 300) // Delay to allow content to render
      }

      return newState
    })
  }

  const toggleViewMoreOrderProgress = (value: boolean) => {
    setToggleViewMoreStates((prev) => ({ ...prev, orderProgress: value }))
    if (value) {
      // Show all completed milestones
      setCompletedMilestones(allCompletedMilestones)
    } else {
      // Show only the most recent 2 completed milestones
      setCompletedMilestones(allCompletedMilestones ? allCompletedMilestones.slice(-2) : null)
    }
  }

  const toggleViewMoreItem = (itemId: string) => {
    setToggleViewMoreStates((prev) => ({
      ...prev,
      [`item-${itemId}`]: !prev[`item-${itemId}`]
    }))
  }

  if (isLoading) {
    return <Loading />
  }

  if ((isFetchedOrder && !order) || orderItemTypeSet.length > 1) {
    return <Redirect href='/' />
  }

  return (
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
            <Feather name='arrow-left' size={24} color={styleConfig.textColor} />
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
            className='flex-1'
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            removeClippedSubviews={false}
            keyboardShouldPersistTaps='handled'
            scrollEventThrottle={16}
          >
            <View key={`order-content-${JSON.stringify(toggleViewMoreStates)}`} className='gap-3 p-2'>
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
                      <Text className='text-xs text-blue-600 font-inter-medium'>Warranty Order</Text>
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

                <View className='border-b border-dashed border-muted-foreground/30' />

                {isDesignRequestOrder ? (
                  <DesignRequestOrderItem
                    designRequest={order?.items[0]?.designRequest}
                    price={order?.items[0]?.price}
                    quantity={order?.items[0]?.quantity}
                  />
                ) : null}

                {isPresetOrder ? (
                  <View className='gap-2'>
                    {isWarrantyOrder
                      ? order?.items?.map((orderItem, index) => (
                          <View key={orderItem.id}>
                            <WarrantyPresetOrderItem
                              orderItem={orderItem}
                              preset={orderItem.preset}
                              presetDetail={presetDetail}
                              presetOptions={orderItem.addOnOptions}
                              quantity={orderItem.quantity}
                              isViewMore={toggleViewMoreStates[`item-${orderItem.id}`] || false}
                              onToggleViewMore={() => toggleViewMoreItem(orderItem.id)}
                              isSameOrder={isSameOrder}
                            />
                            <View
                              className={
                                index !== order?.items?.length - 1
                                  ? 'border-b border-muted-foreground/30 border-dashed'
                                  : ''
                              }
                            />
                          </View>
                        ))
                      : order?.items?.map((orderItem, index) => (
                          <View key={orderItem.id}>
                            <PresetOrderItem
                              orderItem={orderItem}
                              preset={orderItem.preset}
                              presetDetail={presetDetail}
                              presetOptions={orderItem.addOnOptions}
                              quantity={orderItem.quantity}
                              isViewMore={toggleViewMoreStates[`item-${orderItem.id}`] || false}
                              onToggleViewMore={() => toggleViewMoreItem(orderItem.id)}
                            />
                            <View
                              className={
                                index !== order?.items?.length - 1
                                  ? 'border-b border-muted-foreground/30 border-dashed'
                                  : ''
                              }
                            />
                          </View>
                        ))}
                  </View>
                ) : null}

                <View className='border-b border-dashed border-muted-foreground/30' />

                <View className='p-3 flex-row'>
                  <Text className='text-sm font-inter-medium flex-1'>Total {order?.items?.length || 0} Item(s)</Text>
                  <Text className='font-inter-medium text-sm'>
                    <Text className='underline font-inter-medium text-xs'>đ</Text>
                    {merchandiseTotal ? merchandiseTotal.toLocaleString('vi-VN') : '0'}
                  </Text>
                </View>
              </Card>

              {/* Order Progress */}
              {isDisplayOrderProgress ? (
                <OrderProgress
                  allCompletedMilestones={allCompletedMilestones}
                  completedMilestones={completedMilestones}
                  currentMilestone={currentMilestone}
                  isViewMoreOrderProgress={toggleViewMoreStates.orderProgress}
                  setIsViewMoreOrderProgress={toggleViewMoreOrderProgress}
                  setCompletedMilestones={setCompletedMilestones}
                  milestones={milestones}
                  createdAt={order?.createdAt}
                />
              ) : null}

              {/* Designer Information */}
              {isDesignRequestOrder ? <DesignerInformation designerInfo={designerInfo} /> : null}

              {/* Design Request Information */}
              {isDesignRequestOrder && designRequestDetail ? (
                <DesignRequestInformation designRequestDetail={designRequestDetail} handleCheckOut={handleCheckOut} />
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
                isViewMoreOrderDetails={toggleViewMoreStates.orderDetails}
                orderCode={order?.code}
                orderPlacedAt={order?.createdAt}
                toggleViewMore={toggleViewMore}
                totalAmount={order?.totalAmount}
              />
            </View>
          </ScrollView>

          {order?.status === OrderStatus.Created ||
          order?.status === OrderStatus.Completed ||
          order?.status === OrderStatus.Delevering ? (
            <OrderDetailsActions
              orderId={order?.id}
              parentOrderItemId={order?.items[0]?.parentOrderItemId ?? order?.items[0]?.id}
              status={order?.status}
              bottom={bottom}
              orderCode={order?.code}
            />
          ) : null}
        </Card>
      </LinearGradient>
    </BottomSheetModalProvider>
  )
}
