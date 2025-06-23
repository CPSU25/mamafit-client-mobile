import { Feather } from '@expo/vector-icons'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WarningCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { ICON_SIZE, PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

const orderCode = 'ORD-20250623-1058'

export default function PaymentQRCode() {
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <View className='flex flex-row items-center gap-3 p-4'>
          <Feather name='check-circle' size={32} color='#10b981' />
          <View className='flex-1'>
            <Text className='text-xl font-inter-semibold'>Order confirmed!</Text>
            <Text className='text-muted-foreground text-xs'>Order code #{orderCode}</Text>
          </View>
        </View>

        <View className='h-2 bg-muted' />

        <View className='flex flex-col gap-4 p-4'>
          <Card className='p-3 flex-row items-center gap-2' style={[styles.container]}>
            <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
            <Text className='text-sm font-inter-medium flex-1'>Payment status</Text>
            <Text className='text-xs text-amber-600 font-inter-semibold uppercase px-3 py-0.5 rounded-lg bg-amber-100'>
              Awaiting...
            </Text>
          </Card>

          <Card className='p-1' style={[styles.container]}>
            <View className='bg-primary/10 rounded-xl p-2 flex-row items-center gap-2'>
              {SvgIcon.scan({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })}
              <View className='flex-1'>
                <Text className='font-inter-medium text-sm text-primary'>Scan the QR code</Text>
                <Text className='text-primary/70 text-xs'>Pay with your banking app to confirm the order</Text>
              </View>
            </View>
            <Image source={require('~/assets/images/qr-code.png')} className='w-full h-96 mt-4' />
            <View className='p-1 gap-2 mt-2'>
              <WarningCard
                title='Important Payment Note'
                description='Please keep the transfer description unchanged for automatic payment confirmation.'
              />
              <Button variant='outline' className='flex-row items-center gap-2 border-primary/30 rounded-xl'>
                <Feather name='download' size={16} color={PRIMARY_COLOR.LIGHT} />
                <Text className='native:text-sm font-inter-medium text-primary'>Download QR Code</Text>
              </Button>
            </View>
          </Card>

          <Card style={[styles.container]}>
            <View className='p-3 flex-row items-center gap-2'>
              <Feather name='credit-card' size={16} color='black' />
              <Text className='text-sm font-inter-medium'>Payment details</Text>
            </View>
            <Separator />
            <View className='flex flex-col gap-4 p-4'>
              <View className='flex-row justify-between items-center'>
                <Text className='text-xs font-inter-medium text-muted-foreground'>Account holder</Text>
                <Text className='text-xs font-inter-semibold text-foreground'>NGUYEN HUU DANH</Text>
              </View>
              <View className='flex-row justify-between items-center'>
                <Text className='text-xs font-inter-medium text-muted-foreground'>Account number</Text>
                <Text className='text-xs font-inter-semibold text-foreground'>1294 2840 2934 9278</Text>
              </View>
              <View className='flex-row justify-between items-center'>
                <Text className='text-xs font-inter-medium text-muted-foreground'>Amount</Text>
                <View className='bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-md'>
                  <Text className='text-xs font-inter-bold text-primary'>100,000 VND</Text>
                </View>
              </View>
              <View className='flex-row justify-between items-center'>
                <Text className='text-xs font-inter-medium text-muted-foreground'>Transfer description</Text>
                <View className='bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md'>
                  <Text className='text-xs font-inter-semibold text-foreground'>{orderCode}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
