import { Feather } from '@expo/vector-icons'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WarningCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'

const orderCode = 'ORD-20250623-1058'

export default function PaymentQRCode() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
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
              Order code #{orderCode}
            </Text>
          </View>
        </Animated.View>

        <View className='flex flex-col gap-4 p-4'>
          <Animated.View entering={FadeInDown.delay(200)}>
            <Card className='p-3 flex-row items-center gap-2' style={[styles.container]}>
              <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
              <Text
                className={cn('text-sm font-inter-medium flex-1', isDarkColorScheme ? 'text-white' : 'text-gray-900')}
              >
                Payment status
              </Text>
              <Text
                className={cn(
                  'text-xs font-inter-semibold uppercase px-3 py-0.5 rounded-lg',
                  isDarkColorScheme ? 'text-amber-400 bg-amber-900/30' : 'text-amber-600 bg-amber-100'
                )}
              >
                Awaiting...
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
              <Image source={require('~/assets/images/qr-code.png')} className='w-full h-96 mt-4 rounded-2xl' />
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
                >
                  <Feather name='download' size={16} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='native:text-sm font-inter-medium text-primary'>Download QR Code</Text>
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
                  <Text className='text-xs font-inter-semibold'>NGUYEN HUU DANH</Text>
                </View>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xs font-inter-medium'>Account number</Text>
                  <Text className='text-xs font-inter-semibold'>1294 2840 2934 9278</Text>
                </View>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xs font-inter-medium'>Amount</Text>
                  <View className={cn('px-2 py-1 rounded-md', isDarkColorScheme ? 'bg-primary/30' : 'bg-primary/20')}>
                    <Text className='text-xs font-inter-bold text-primary'>đ100.000</Text>
                  </View>
                </View>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-xs font-inter-medium'>Transfer description</Text>
                  <View className={cn('px-2 py-1 rounded-md', isDarkColorScheme ? 'bg-gray-800' : 'bg-gray-100')}>
                    <Text className='text-xs font-inter-semibold'>{orderCode}</Text>
                  </View>
                </View>
              </View>
            </Card>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
