import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
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
import { ORDER_STATUS_TYPES, statusStyles } from '~/features/order/constants'
import { useGetDesignRequestPreset } from '~/features/order/hooks/use-get-design-request-preset'
import { useGetDesignerInfo } from '~/features/order/hooks/use-get-designer-info'
import { useGetOrder } from '~/features/order/hooks/use-get-order'
import { useGetOrderItemMilestones } from '~/features/order/hooks/use-get-order-item-milestones'
import { useGetWarrantyRequest } from '~/features/order/hooks/use-get-warranty-request'
import { PresetItem } from '~/features/order/types'
import { getOrderItemTypeStyle, getStatusIcon } from '~/features/order/utils'
import { useGetPresetDetail } from '~/features/preset/hooks/use-get-preset-detail'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
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
      // order?.status !== OrderStatus.Confirmed &&
      order?.status !== OrderStatus.InDesign &&
      order?.status !== OrderStatus.Cancelled &&
      order?.status !== OrderStatus.Completed,
    [isPresetAndWarrantyOrder, order?.status]
  )
  const isWarrantyOrder = useMemo(() => order?.type === OrderType.Warranty, [order?.type])

  const {
    data: warrantyRequest,
    isLoading: isLoadingWarrantyRequest,
    refetch: refetchWarrantyRequest
  } = useGetWarrantyRequest(order?.items[0]?.parentOrderItemId || '', Boolean(isWarrantyOrder) && isFetchedOrder)

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
  const [isViewMoreOrderDetails, setIsViewMoreOrderDetails] = useState(false)
  const [isViewMoreOrderProgress, setIsViewMoreOrderProgress] = useState(false)
  const [completedMilestones, setCompletedMilestones] = useState<OrderItemMilestone[] | null>(null)
  const [allCompletedMilestones, setAllCompletedMilestones] = useState<OrderItemMilestone[] | null>(null)
  const [currentMilestone, setCurrentMilestone] = useState<OrderItemMilestone | null>(null)

  const merchandiseTotal = useMemo(() => {
    return order?.items?.reduce((acc, item) => acc + (item.preset?.price || 0), 0)
  }, [order?.items])

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
    isLoadingWarrantyRequest

  const { refreshControl } = useRefreshs([
    refetchOrder,
    refetchCurrentUser,
    refetchPresetDetail,
    refetchMilestones,
    refetchDesignerInfo,
    refetchConfig,
    refetchDesignRequestDetail,
    refetchWarrantyRequest
  ])

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
      const newPreset: PresetItem = {
        ...preset,
        addOnOptions: []
      }

      await AsyncStorage.setItem(
        'order-items',
        JSON.stringify({
          type: 'preset',
          items: [newPreset]
        })
      )
      router.push('/order/review')
    } catch (error) {
      console.log(error)
    }
  }

  const toggleViewMore = () => {
    setIsViewMoreOrderDetails((prev) => {
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
          <View key={`order-content-${isViewMoreOrderDetails ? 'expanded' : 'collapsed'}`} className='gap-3 p-2'>
            {/* Warranty Information */}
            {isWarrantyOrder && warrantyRequest ? <WarrantyInfoCard warrantyRequest={warrantyRequest} /> : null}

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

            {isPresetOrder ? <DiaryInformation diary={order?.measurementDiary} /> : null}

            <Card className='bg-muted/5' style={styles.container}>
              <View className='flex-row items-center gap-2 flex-wrap p-3'>
                {order?.type === OrderType.Warranty ? (
                  <View className='px-3 py-1.5 bg-pink-50 rounded-lg flex-row items-center gap-1.5'>
                    <MaterialIcons name='safety-check' size={14} color='#db2777' />
                    <Text className='text-xs text-pink-600 font-inter-medium'>Warranty Order</Text>
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
                  {order?.items?.map((preset, index) => (
                    <View key={preset.id}>
                      <PresetOrderItem
                        preset={preset.preset}
                        presetDetail={presetDetail}
                        quantity={order?.items?.[0]?.quantity}
                      />
                      <View
                        className={
                          index !== order?.items?.length - 1
                            ? 'border-b border-muted-foreground/30 border-dashed mt-2'
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

            {isDisplayOrderProgress ? (
              <OrderProgress
                allCompletedMilestones={allCompletedMilestones}
                completedMilestones={completedMilestones}
                currentMilestone={currentMilestone}
                isViewMoreOrderProgress={isViewMoreOrderProgress}
                setIsViewMoreOrderProgress={setIsViewMoreOrderProgress}
                setCompletedMilestones={setCompletedMilestones}
                milestones={milestones}
                createdAt={order?.createdAt}
              />
            ) : null}

            {isDesignRequestOrder ? <DesignerInformation designerInfo={designerInfo} /> : null}

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
              isViewMoreOrderDetails={isViewMoreOrderDetails}
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
  )
}
