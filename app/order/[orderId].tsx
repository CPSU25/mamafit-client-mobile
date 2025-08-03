import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Image, ScrollView, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import OrderStageBar from '~/features/order/components/order-stage-bar'
import PreviewLatestMeasurement from '~/features/order/components/preview-latest-measurement'
import { ORDER_STATUS_TYPES, statusStyles } from '~/features/order/constants'
import { useGetDesignRequestPreset } from '~/features/order/hooks/use-get-design-request-preset'
import { useGetDesignerInfo } from '~/features/order/hooks/use-get-designer-info'
import { useGetOrder } from '~/features/order/hooks/use-get-order'
import { useGetOrderItemMilestones } from '~/features/order/hooks/use-get-order-item-milestones'
import { getOrderItemTypeStyle, getStatusIcon } from '~/features/order/utils'
import { useGetPresetDetail } from '~/features/preset/hooks/use-get-preset-detail'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
import { useAuth } from '~/hooks/use-auth'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useGetConfig } from '~/hooks/use-get-config'
import { useRefreshs } from '~/hooks/use-refresh'
import { placeholderImage, PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { cn, formatVnPhone, getOrderedComponentOptions, isValidUrl, openInMaps } from '~/lib/utils'
import {
  DeliveryMethod,
  OrderItemMilestone,
  OrderItemType,
  OrderStatus,
  OrderType,
  PaymentType
} from '~/types/order.type'

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
  const { isDarkColorScheme } = useColorScheme()
  const { width } = useWindowDimensions()

  const { data: config, isLoading: isLoadingConfig, refetch: refetchConfig } = useGetConfig()

  const {
    data: order,
    isLoading: isLoadingOrder,
    refetch: refetchOrder,
    isFetched: isFetchedOrder
  } = useGetOrder(orderId)

  const orderItemTypeSet = useMemo(() => [...new Set(order?.items?.map((item) => item.itemType) || [])], [order?.items])

  const isPresetOrder = useMemo(
    () => orderItemTypeSet[0] === OrderItemType.Preset && order?.items?.[0]?.preset != null,
    [orderItemTypeSet, order?.items]
  )

  const isDesignRequestOrder = useMemo(
    () => orderItemTypeSet[0] === OrderItemType.DesignRequest && order?.items?.[0]?.designRequest != null,
    [orderItemTypeSet, order?.items]
  )

  const isDisplayOrderProgress = useMemo(
    () =>
      orderItemTypeSet[0] === OrderItemType.Preset &&
      order?.status !== OrderStatus.Created &&
      order?.status !== OrderStatus.Confirmed &&
      order?.status !== OrderStatus.InDesign &&
      order?.status !== OrderStatus.Cancelled &&
      order?.status !== OrderStatus.Completed,
    [orderItemTypeSet, order?.status]
  )

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
  const [dialogOpen, setDialogOpen] = useState(false)

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
    isLoadingDesignRequestDetail

  const { refreshControl } = useRefreshs([
    refetchOrder,
    refetchCurrentUser,
    refetchPresetDetail,
    refetchMilestones,
    refetchDesignerInfo,
    refetchConfig,
    refetchDesignRequestDetail
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
        className='flex-1 mx-2 mt-3.5 rounded-t-3xl rounded-b-none border-transparent'
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
            {/* Shipping Information */}
            {!isDesignRequestOrder ? (
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
                <>
                  <View className='px-3 py-2 flex-row items-center gap-2'>
                    <MaterialCommunityIcons name='truck-fast' size={16} color='#059669' />
                    <Text className='font-inter-medium text-sm'>Delivery Information</Text>
                  </View>

                  <Separator />

                  <View className='flex-1 p-3'>
                    {order?.deliveryMethod === DeliveryMethod.Delivery && order.address ? (
                      <>
                        <View className='flex-row items-center gap-2 mb-0.5'>
                          <Text className='text-sm font-inter-medium' numberOfLines={1}>
                            {currentUser?.fullName}{' '}
                            <Text className='text-muted-foreground text-xs'>
                              {currentUser?.phoneNumber
                                ? formatVnPhone(currentUser?.phoneNumber)
                                : '(missing phone number)'}
                            </Text>
                          </Text>
                          <View className='bg-emerald-50 rounded-lg px-2 py-0.5'>
                            <Text className='text-xs font-inter-medium text-emerald-600 text-center'>Ship</Text>
                          </View>
                        </View>
                        <Text className='text-xs text-muted-foreground' numberOfLines={2}>
                          {order?.address?.street}, {order?.address?.ward}, {order?.address?.district},{' '}
                          {order?.address?.province}
                        </Text>
                      </>
                    ) : null}
                    {order?.deliveryMethod === DeliveryMethod.PickUp && order.branch ? (
                      <>
                        <View className='flex-row items-center gap-2 mb-0.5'>
                          <Text className='text-sm font-inter-medium'>{order.branch?.name}</Text>
                          <View className='bg-emerald-50 rounded-lg px-2 py-0.5'>
                            <Text className='text-xs font-inter-medium text-emerald-600 text-center'>Pickup</Text>
                          </View>
                        </View>
                        <Text className='text-xs text-muted-foreground' numberOfLines={2}>
                          {order?.branch?.street}, {order?.branch?.ward}, {order?.branch?.district},{' '}
                          {order?.branch?.province}
                        </Text>
                        <TouchableOpacity
                          className='px-4 py-2 rounded-xl flex-row items-center justify-center gap-2 bg-emerald-50 mt-2'
                          onPress={() => openInMaps(order?.branch?.latitude ?? 0, order?.branch?.longitude ?? 0)}
                        >
                          <Feather name='map' size={16} color='#059669' />
                          <Text className='text-sm text-emerald-600 font-inter-medium'>Open in Maps</Text>
                        </TouchableOpacity>
                      </>
                    ) : null}
                  </View>
                </>
              </Card>
            ) : null}

            {isPresetOrder ? (
              <Card style={styles.container}>
                <View className='flex-row items-center gap-2 px-3 py-2'>
                  <MaterialCommunityIcons name='book-multiple' size={16} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='font-inter-medium text-sm'>Diary Information</Text>
                </View>

                <Separator />

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <TouchableOpacity className='flex-1 gap-1 p-3'>
                      <Text className='font-inter-medium' numberOfLines={1}>
                        {order?.measurementDiary?.name}{' '}
                        <Text className='text-xs text-muted-foreground'>
                          ({order?.measurementDiary?.age} years old)
                        </Text>
                      </Text>
                      <View className='flex-row items-center gap-2'>
                        <Text className='text-xs text-muted-foreground'>
                          Weight: {order?.measurementDiary?.weight}kg
                        </Text>
                        <Separator orientation='vertical' className='h-4' />
                        <Text className='text-xs text-muted-foreground'>
                          Height: {order?.measurementDiary?.height}cm
                        </Text>
                        <Separator orientation='vertical' className='h-4' />
                        <Text className='text-xs text-muted-foreground'>
                          Pregnancy: {order?.measurementDiary?.numberOfPregnancy}
                          {order?.measurementDiary?.numberOfPregnancy === 1
                            ? 'st'
                            : order?.measurementDiary?.numberOfPregnancy === 2
                              ? 'nd'
                              : order?.measurementDiary?.numberOfPregnancy === 3
                                ? 'rd'
                                : 'th'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </DialogTrigger>
                  <DialogContent
                    displayCloseButton={false}
                    style={{
                      padding: 16,
                      width: width - 30
                    }}
                  >
                    <PreviewLatestMeasurement measurement={order?.measurementDiary?.measurements?.[0]} />
                    <Button variant='outline' onPress={() => setDialogOpen(false)}>
                      <Text className='font-inter-medium'>Close</Text>
                    </Button>
                  </DialogContent>
                </Dialog>
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
                {isDesignRequestOrder ? (
                  <View className='flex-row items-start gap-2'>
                    <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/10'>
                      <Image
                        source={{ uri: order?.items?.[0]?.designRequest?.images?.[0] }}
                        className='w-full h-full'
                        resizeMode='cover'
                      />
                    </View>
                    <View className='flex-1 h-20 justify-between'>
                      <View>
                        <Text className='text-sm font-inter-medium'>Design Request</Text>
                        <View className='flex-row items-center justify-between'>
                          <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
                            {order?.items?.[0]?.designRequest?.description}
                          </Text>
                          <Text className='text-xs text-muted-foreground'>x{order?.items?.[0]?.quantity || 1}</Text>
                        </View>
                      </View>
                      <View className='items-end'>
                        <Text className='text-xs'>
                          <Text className='text-xs underline'>đ</Text>
                          {order?.items?.[0]?.price?.toLocaleString('vi-VN') || '0'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}

                {isPresetOrder ? (
                  <>
                    <View className='flex-row items-start gap-2'>
                      <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
                        <Image
                          source={{ uri: order?.items?.[0]?.preset?.images?.[0] }}
                          className='w-full h-full'
                          resizeMode='contain'
                        />
                      </View>
                      <View className='flex-1 h-20 justify-between'>
                        <View>
                          <Text className='text-sm font-inter-medium'>
                            {order?.items?.[0]?.preset?.styleName || 'Custom'} Dress
                          </Text>
                          <View className='flex-row items-center justify-between'>
                            <Text className='text-xs text-muted-foreground'>Custom Made-to-Order</Text>
                            <Text className='text-xs text-muted-foreground'>x{order?.items?.[0]?.quantity || 1}</Text>
                          </View>
                        </View>
                        <View className='items-end'>
                          <Text className='text-xs'>
                            <Text className='text-xs underline'>đ</Text>
                            {order?.items?.[0]?.price?.toLocaleString('vi-VN') || '0'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className='bg-muted/50 rounded-xl p-3 gap-2 mt-2'>
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

              <View className='px-3 py-2 flex-row'>
                <Text className='text-sm font-inter-medium flex-1'>Total {order?.items?.length || 0} Item(s)</Text>
                <Text className='font-inter-medium text-sm'>
                  <Text className='underline font-inter-medium text-xs'>đ</Text>
                  {order?.items?.[0]?.price?.toLocaleString('vi-VN') || '0'}
                </Text>
              </View>
            </Card>

            {isDisplayOrderProgress ? (
              <Card className='bg-muted/5' style={styles.container}>
                <View className='px-3 py-2 flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='clipboard-text-clock' size={16} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='font-inter-medium text-sm'>Order Progress</Text>
                </View>

                <Separator />

                {milestones && Array.isArray(milestones) && milestones.length > 0 ? (
                  <OrderStageBar
                    milestones={milestones}
                    currentMilestone={currentMilestone}
                    completedMilestones={completedMilestones}
                    orderPlacedAt={order?.createdAt}
                  />
                ) : (
                  <View className='flex-row items-center justify-center my-10'>
                    <Text className='text-muted-foreground text-xs'>No order progress available</Text>
                  </View>
                )}

                {(allCompletedMilestones?.length || 0) > 2 ? (
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

            {isDesignRequestOrder ? (
              <Card className='p-3' style={styles.container}>
                {designerInfo && designerInfo.designer && designerInfo.chatRoomId ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (designerInfo.chatRoomId) {
                        router.push({
                          pathname: '/chat/[roomId]',
                          params: { roomId: designerInfo.chatRoomId }
                        })
                      }
                    }}
                  >
                    <View className='flex-row items-center gap-3'>
                      <Avatar
                        alt={designerInfo.designer.fullName || 'designer-avatar'}
                        className='border-2 border-emerald-500'
                      >
                        <AvatarImage
                          source={{
                            uri:
                              designerInfo.designer.profilePicture && isValidUrl(designerInfo.designer.profilePicture)
                                ? designerInfo.designer.profilePicture
                                : placeholderImage
                          }}
                        />
                        <AvatarFallback>
                          <Text>{designerInfo.designer.fullName?.charAt(0)}</Text>
                        </AvatarFallback>
                      </Avatar>
                      <View>
                        <Text className='text-sm font-inter-medium' numberOfLines={1}>
                          {designerInfo.designer.fullName}
                        </Text>
                        <Text className='text-xs text-muted-foreground'>Press to chat now</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View className='flex-row items-center gap-3'>
                    <Avatar alt='designer-avatar'>
                      <AvatarImage
                        source={{
                          uri: placeholderImage
                        }}
                      />
                      <AvatarFallback>
                        <Text>N/A</Text>
                      </AvatarFallback>
                    </Avatar>
                    <View>
                      <Text className='text-sm font-inter-medium'>
                        Your Designer <Text className='text-xs text-muted-foreground/80'>(not assigned yet)</Text>
                      </Text>
                      <Text className='text-xs text-muted-foreground' numberOfLines={1}>
                        Please wait for the designer to be assigned to you
                      </Text>
                    </View>
                  </View>
                )}
              </Card>
            ) : null}

            {isDesignRequestOrder && designRequestDetail ? (
              <Card style={styles.container}>
                <View className='px-3 py-2 flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='file-multiple' size={16} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='font-inter-medium text-sm'>
                    Your Designed Presets{' '}
                    <Text className='text-xs text-muted-foreground'>({designRequestDetail?.length || 0})</Text>
                  </Text>
                </View>

                <Separator />

                <View className='p-3 gap-3'>
                  {designRequestDetail?.length > 0 ? (
                    designRequestDetail?.map((preset, index) => (
                      <View key={preset.id} className='flex-row items-start gap-2'>
                        <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
                          <Image source={{ uri: preset.images?.[0] }} className='w-full h-full' resizeMode='contain' />
                        </View>
                        <View className='flex-1 h-20 justify-between'>
                          <View>
                            <Text className='text-sm font-inter-medium'>
                              {preset.name ? preset.name : 'Untitled Preset'}
                            </Text>
                            <View className='flex-row items-center justify-between'>
                              <Text className='text-xs text-muted-foreground'>Version {index + 1}</Text>
                              <Text className='text-xs text-muted-foreground'>x1</Text>
                            </View>
                          </View>
                          <View className='items-end'>
                            <Text className='text-xs'>
                              <Text className='text-xs underline'>đ</Text>
                              {preset.price?.toLocaleString('vi-VN') || '0'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View className='flex-row items-center justify-center my-4'>
                      <Text className='text-muted-foreground text-xs'>No preset designed yet</Text>
                    </View>
                  )}
                </View>
              </Card>
            ) : null}

            {/* Order Details */}
            <Card className='bg-muted/5' style={styles.container}>
              <View className='px-3 py-2 flex-row items-center gap-2'>
                <MaterialCommunityIcons name='receipt' size={16} color={PRIMARY_COLOR.LIGHT} />
                <Text className='font-inter-medium text-sm'>Order Details</Text>
              </View>

              <Separator />

              <View className='gap-1 p-3'>
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

                {isViewMoreOrderDetails ? (
                  <View className='gap-1'>
                    {order?.subTotalAmount ? (
                      <View className='flex-row items-center gap-2'>
                        <Text className='flex-1 text-xs text-muted-foreground/80'>Merchandise Subtotal</Text>
                        <Text className='text-foreground/80 text-xs'>
                          đ{order?.subTotalAmount > 0 ? order.subTotalAmount.toLocaleString('vi-VN') : '0'}
                        </Text>
                      </View>
                    ) : null}

                    {order?.serviceAmount ? (
                      <View className='flex-row items-center gap-2'>
                        <Text className='flex-1 text-xs text-muted-foreground/80'>Add-Ons Fee</Text>
                        <Text className='text-foreground/80 text-xs'>
                          đ{order?.serviceAmount > 0 ? order.serviceAmount.toLocaleString('vi-VN') : '0'}
                        </Text>
                      </View>
                    ) : null}

                    {order?.voucherDiscountId && order?.discountSubtotal ? (
                      <View className='flex-row items-center gap-2'>
                        <Text className='flex-1 text-xs text-muted-foreground/80'>Voucher Discount</Text>
                        <Text className='text-foreground/80 text-xs'>
                          đ{order?.discountSubtotal > 0 ? order.discountSubtotal.toLocaleString('vi-VN') : '0'}
                        </Text>
                      </View>
                    ) : null}

                    {order?.paymentType === PaymentType.Deposit && order?.depositSubtotal ? (
                      <View className='flex-row items-center gap-2'>
                        <Text className='flex-1 text-xs text-muted-foreground/80'>
                          Deposit Subtotal (
                          {config?.depositRate && !isNaN(config.depositRate) ? `${config.depositRate * 100}%` : '0%'})
                        </Text>
                        <Text className='text-foreground/80 text-xs'>
                          đ{order?.depositSubtotal > 0 ? order.depositSubtotal.toLocaleString('vi-VN') : '0'}
                        </Text>
                      </View>
                    ) : null}

                    {order?.paymentType === PaymentType.Deposit && order?.remainingBalance ? (
                      <View className='flex-row items-center gap-2'>
                        <Text className='flex-1 text-xs text-primary font-inter-medium'>
                          Remaining Balance (
                          {config?.depositRate && !isNaN(config.depositRate)
                            ? `${100 - config.depositRate * 100}%`
                            : '0%'}
                          )
                        </Text>
                        <Text className='text-primary font-inter-medium text-xs'>
                          đ{order?.remainingBalance > 0 ? order.remainingBalance.toLocaleString('vi-VN') : '0'}
                        </Text>
                      </View>
                    ) : null}

                    {order?.shippingFee ? (
                      <View className='flex-row items-center gap-2'>
                        <Text className='flex-1 text-xs text-muted-foreground/80'>Shipping Fee</Text>
                        <Text className='text-foreground/80 text-xs'>
                          đ{order?.shippingFee > 0 ? order.shippingFee.toLocaleString('vi-VN') : '0'}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {isViewMoreOrderDetails ? <Separator className='mt-1 mb-2' /> : null}

                <View className='flex-row items-center gap-2'>
                  <Text
                    className={cn(
                      'flex-1 text-xs text-muted-foreground/80',
                      isViewMoreOrderDetails && 'font-inter-medium text-foreground text-sm'
                    )}
                  >
                    Total Amount
                  </Text>
                  <Text
                    className={cn('text-foreground/80 text-xs', isViewMoreOrderDetails && 'font-inter-medium text-sm')}
                  >
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
