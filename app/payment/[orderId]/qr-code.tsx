import { Feather } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { WarningCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useGetPaymentStatus } from '~/features/order/hooks/use-get-payment-status'
import { useGetQRCode } from '~/features/order/hooks/use-get-qr-code'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useOnAppForeground } from '~/hooks/use-on-app-foreground'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { OrderStatus, PaymentStatus } from '~/types/order.type'

const getQRCodeParams = (url: string | undefined) => {
  if (!url)
    return {
      acc: '',
      bank: '',
      amount: '0',
      des: ''
    }

  const parsedUrl = new URL(url)
  const params = new URLSearchParams(parsedUrl.search)

  return {
    acc: params.get('acc') ?? '',
    bank: params.get('bank') ?? '',
    amount: params.get('amount') ?? '0',
    des: params.get('des') ?? ''
  }
}

export default function PaymentQRCode() {
  const queryClient = useQueryClient()
  const { isDarkColorScheme } = useColorScheme()
  const { orderId } = useLocalSearchParams() as { orderId: string }
  const [downloading, setDownloading] = useState(false)
  const router = useRouter()
  const {
    data: paymentStatus,
    refetch: refetchPaymentStatus,
    isFetched: isPaymentStatusFetched,
    isLoading: isPaymentStatusLoading
  } = useGetPaymentStatus(orderId)

  const { data: qrCodeData, refetch: refetchQRCode, isLoading: isQRCodeLoading } = useGetQRCode(orderId)

  const { refreshControl } = useRefreshs([refetchQRCode, refetchPaymentStatus])

  const isPaid =
    paymentStatus === PaymentStatus.PaidFull ||
    (paymentStatus === PaymentStatus.PaidDeposit &&
      qrCodeData?.orderWithItem?.status !== OrderStatus.AwaitingPaidRest) ||
    paymentStatus === PaymentStatus.PaidDepositCompleted

  const isPaymentSuccess = isPaymentStatusFetched && !isPaymentStatusLoading && isPaid

  const isLoading = isPaymentStatusLoading || isQRCodeLoading

  useOnAppForeground(() => {
    console.log('User is back to the app')
    refetchPaymentStatus()
    refetchQRCode()
    if (isPaid) {
      queryClient.invalidateQueries({ queryKey: ['order'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders-count'] })
      queryClient.invalidateQueries({ queryKey: ['order-item-milestones'] })
      queryClient.invalidateQueries({ queryKey: ['designer-info'] })
    }
  })

  useFocusEffect(
    useCallback(() => {
      refetchPaymentStatus()
      refetchQRCode()
      if (isPaid) {
        queryClient.invalidateQueries({ queryKey: ['order'] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['orders-count'] })
        queryClient.invalidateQueries({ queryKey: ['order-item-milestones'] })
        queryClient.invalidateQueries({ queryKey: ['designer-info'] })
      }
    }, [refetchPaymentStatus, refetchQRCode, queryClient, isPaid])
  )

  if (isLoading) return <Loading />

  const handleDownload = async (imageUrl: string | undefined) => {
    if (!imageUrl) return

    try {
      setDownloading(true)
      const fileUri = FileSystem.documentDirectory + 'qr-code.png'
      const downloadResumable = FileSystem.createDownloadResumable(imageUrl, fileUri)
      const { uri } = (await downloadResumable.downloadAsync()) as FileSystem.FileSystemDownloadResult

      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow media access to save the image.')
        return
      }

      const asset = await MediaLibrary.createAssetAsync(uri)
      await MediaLibrary.createAlbumAsync('Download', asset, false)
    } finally {
      setDownloading(false)
    }
  }

  const handleGoHome = () => {
    router.replace('/')
  }

  const qrCodeParams = getQRCodeParams(qrCodeData?.qrUrl)

  if (isPaymentSuccess) {
    return (
      <SafeView>
        <ScrollView className='flex-1' refreshControl={refreshControl} showsVerticalScrollIndicator={false}>
          <View className='flex-1 p-4'>
            <View className='flex-1 items-center justify-center mt-40'>
              <LottieView
                source={require('~/assets/lottie/payment-success.json')}
                autoPlay
                loop={false}
                style={{ width: 300, height: 300 }}
              />
              <Text className='text-2xl font-inter-semibold mt-10'>Payment successful!</Text>
              <Text className='text-sm text-muted-foreground mt-2 mx-10 text-center'>
                Your transaction has been completed. Thank you for your purchase!
              </Text>
            </View>

            <View className='flex flex-col gap-2 w-full mt-32'>
              <Button
                className='w-full'
                onPress={() =>
                  router.replace({
                    pathname: '/order/[orderId]',
                    params: { orderId }
                  })
                }
              >
                <Text className='font-inter-medium'>View Order</Text>
              </Button>
              <Button className='w-full' variant='outline' onPress={handleGoHome}>
                <Text className='font-inter-medium'>Back To Home</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeView>
    )
  }

  // Show QR code page when payment is pending

  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1' refreshControl={refreshControl}>
        <Animated.View
          entering={FadeInDown.delay(100)}
          className={cn(
            'flex flex-row items-center gap-3 p-4',
            isDarkColorScheme ? 'bg-emerald-950/20' : 'bg-emerald-50'
          )}
        >
          <Feather name='check-circle' size={32} color='#10b981' />
          <View className='flex-1'>
            <Text
              className={cn('text-xl font-inter-semibold', isDarkColorScheme ? 'text-emerald-400' : 'text-emerald-600')}
            >
              Order confirmed!
            </Text>
            <Text className={cn('text-xs', isDarkColorScheme ? 'text-emerald-300/80' : 'text-emerald-600')}>
              Order code #{qrCodeData?.orderWithItem?.code}
            </Text>
          </View>
        </Animated.View>

        <View className='flex flex-col gap-4 p-4'>
          <Animated.View entering={FadeInDown.delay(200)}>
            <Card className='p-3 flex-row items-center gap-2' style={[styles.container]}>
              {isPaymentSuccess ? (
                <Feather name='check' size={18} color='#10b981' />
              ) : (
                <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
              )}
              <Text
                className={cn('text-sm font-inter-medium flex-1', isDarkColorScheme ? 'text-white' : 'text-gray-900')}
              >
                Payment status
              </Text>
              <Text
                className={cn(
                  'text-xs font-inter-semibold uppercase px-3 py-0.5 rounded-lg',
                  isPaymentSuccess
                    ? isDarkColorScheme
                      ? 'text-emerald-400 bg-emerald-900/30'
                      : 'text-emerald-600 bg-emerald-100'
                    : isDarkColorScheme
                      ? 'text-amber-400 bg-amber-900/30'
                      : 'text-amber-600 bg-amber-100'
                )}
              >
                {paymentStatus ?? 'Pending'}
              </Text>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            <Card className='p-1' style={[styles.container]}>
              <View
                className={cn(
                  'rounded-xl p-2 flex-row items-center gap-2',
                  isDarkColorScheme ? 'bg-primary/20' : 'bg-primary/10'
                )}
              >
                {SvgIcon.scan({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })}
                <View className='flex-1'>
                  <Text
                    className={cn(
                      'font-inter-medium text-sm',
                      isDarkColorScheme ? 'text-primary-foreground' : 'text-primary'
                    )}
                  >
                    Scan the QR code
                  </Text>
                  <Text className={cn('text-xs', isDarkColorScheme ? 'text-primary-foreground/70' : 'text-primary/70')}>
                    Pay with your banking app to confirm the order
                  </Text>
                </View>
              </View>
              <Image source={{ uri: qrCodeData?.qrUrl }} className='w-full h-96 mt-4 rounded-2xl' />
              <View className='p-1 gap-2 mt-2'>
                <WarningCard
                  title='Important Payment Note'
                  description='Please keep the transfer description unchanged for automatic payment confirmation.'
                  delay={400}
                />
                <Button
                  variant='outline'
                  className={cn(
                    'flex-row items-center gap-2 rounded-xl',
                    isDarkColorScheme ? 'border-primary/50' : 'border-primary/30'
                  )}
                  onPress={() => handleDownload(qrCodeData?.qrUrl)}
                  disabled={downloading}
                >
                  <Feather name='download' size={16} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='native:text-sm font-inter-medium text-primary'>
                    {downloading ? 'Downloading...' : 'Download QR Code'}
                  </Text>
                </Button>
              </View>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500)}>
            <Card style={[styles.container]}>
              <View className='p-3 flex-row items-center gap-2'>
                <Feather name='credit-card' size={16} color={isDarkColorScheme ? 'white' : 'black'} />
                <Text className={cn('text-sm font-inter-medium', isDarkColorScheme ? 'text-white' : 'text-gray-900')}>
                  Payment details
                </Text>
              </View>
              <Separator />
              <View className='flex flex-col gap-3 p-4'>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xs font-inter-medium'>Account holder</Text>
                  <Text className='text-xs font-inter-semibold'>LE DUC ANH</Text>
                </View>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xs font-inter-medium'>Account number</Text>
                  <Text className='text-xs font-inter-semibold'>{qrCodeParams.acc}</Text>
                </View>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xs font-inter-medium'>Amount</Text>
                  <View className={cn('px-2 py-1 rounded-md', isDarkColorScheme ? 'bg-primary/30' : 'bg-primary/20')}>
                    <Text className='text-xs font-inter-bold text-primary'>
                      đ
                      {qrCodeParams?.amount
                        ? new Intl.NumberFormat('vi-VN').format(Number(qrCodeParams.amount))
                        : '0.000'}
                    </Text>
                  </View>
                </View>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xs font-inter-medium'>Transfer description</Text>
                  <View className={cn('px-2 py-1 rounded-md', isDarkColorScheme ? 'bg-gray-800' : 'bg-gray-100')}>
                    <Text className='text-xs font-inter-semibold'>{qrCodeParams.des}</Text>
                  </View>
                </View>
              </View>
            </Card>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeView>
  )
}
