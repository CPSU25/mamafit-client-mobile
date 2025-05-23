import Svg, { G, Path } from 'react-native-svg'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants'

interface Notification {
  id: number
  name: string
  description: string
  icon: React.ReactNode
}

const ICON_SIZE = 50

const notifications: Notification[] = [
  {
    id: 1,
    name: 'Promotions',
    description: 'Latest deals and special offers.',
    icon: (
      <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 1024 1024'>
        <G>
          <Path d='M512 512m-480 0a480 480 0 1 0 960 0 480 480 0 1 0-960 0Z' fill='#FEE8EB' />
          <Path
            d='M601.6 473.6c-57.6-64-57.6-140.8-57.6-249.6-179.2 70.4-134.4 262.4-140.8 326.4-44.8-38.4-57.6-128-57.6-128C294.4 448 268.8 512 268.8 563.2c0 128 108.8 236.8 243.2 236.8s243.2-102.4 243.2-236.8c0-76.8-57.6-115.2-57.6-217.6-83.2 25.6-96 89.6-96 128z'
            fill='#FF6B6A'
          />
          <Path
            d='M505.6 537.6c83.2 32 64 121.6 64 147.2 19.2-19.2 25.6-57.6 25.6-57.6 19.2 12.8 32 38.4 32 64 0 57.6-51.2 108.8-108.8 108.8s-108.8-51.2-108.8-108.8c6.4-57.6 96-102.4 96-153.6z'
            fill='#FFA9B1'
          />
        </G>
      </Svg>
    )
  },
  {
    id: 2,
    name: 'Order Updates',
    description: 'Track your order from start to finish.',
    icon: (
      <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 1024 1024'>
        <G>
          <Path d='M512 512m-480 0a480 480 0 1 0 960 0 480 480 0 1 0-960 0Z' fill='#FFE5CF' />
          <Path
            d='M262.4 307.2c0-19.2 19.2-38.4 38.4-38.4h435.2c19.2 0 38.4 12.8 38.4 38.4 0 19.2-19.2 38.4-38.4 38.4H294.4c-19.2 0-32-19.2-32-38.4z'
            fill='#FF8746'
          />
          <Path
            d='M294.4 307.2v448c0 19.2 25.6 32 38.4 19.2l32-32 32 25.6c6.4 6.4 25.6 6.4 32 0l32-32 32 32c6.4 6.4 25.6 6.4 32 0l32-32 32 32c6.4 6.4 25.6 6.4 32 0l32-32 32 32c12.8 12.8 38.4 6.4 38.4-19.2V307.2H294.4z'
            fill='#FF9D68'
          />
          <Path
            d='M371.2 403.2c0-6.4 6.4-12.8 12.8-12.8h217.6c6.4 0 12.8 6.4 12.8 12.8s-6.4 12.8-12.8 12.8H377.6c-6.4 0-6.4-6.4-6.4-12.8zM371.2 473.6c0-6.4 6.4-12.8 12.8-12.8h166.4c6.4 0 12.8 6.4 12.8 12.8s-6.4 12.8-12.8 12.8H377.6c-6.4 0-6.4-6.4-6.4-12.8zM371.2 550.4c0-6.4 6.4-12.8 12.8-12.8h262.4c6.4 0 12.8 6.4 12.8 12.8s-6.4 12.8-12.8 12.8H377.6c-6.4 0-6.4-6.4-6.4-12.8zM371.2 620.8c0-6.4 6.4-12.8 12.8-12.8h217.6c6.4 0 12.8 6.4 12.8 12.8s-6.4 12.8-12.8 12.8H377.6c-6.4 0-6.4-6.4-6.4-12.8z'
            fill='#F27632'
          />
        </G>
      </Svg>
    )
  },
  {
    id: 3,
    name: 'Payment Status',
    description: "Don't forget to pay your bills on time.",
    icon: (
      <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox='0 0 1024 1024'>
        <G>
          <Path d='M512 512m-480 0a480 480 0 1 0 960 0 480 480 0 1 0-960 0Z' fill='#FFF0C2' />
          <Path
            d='M371.2 704c0-12.8 12.8-25.6 25.6-25.6h384c12.8 0 25.6 12.8 25.6 25.6v44.8c0 12.8-12.8 25.6-25.6 25.6h-384c-12.8 0-25.6-12.8-25.6-25.6V704zM371.2 563.2c0-12.8 12.8-25.6 25.6-25.6h384c12.8 0 25.6 12.8 25.6 25.6v44.8c0 12.8-12.8 25.6-25.6 25.6h-384c-12.8 0-25.6-12.8-25.6-25.6v-44.8zM416 416c0-12.8 12.8-25.6 25.6-25.6h384c12.8 0 25.6 12.8 25.6 25.6v44.8c0 12.8-12.8 25.6-25.6 25.6h-384c-12.8 0-25.6-12.8-25.6-25.6v-44.8zM320 275.2c0-19.2 12.8-25.6 25.6-25.6h384c12.8 0 25.6 12.8 25.6 25.6V320c0 12.8-12.8 25.6-25.6 25.6h-384c-12.8 0-25.6-12.8-25.6-25.6v-44.8z'
            fill='#FFE085'
          />
          <Path d='M416 563.2m-217.6 0a217.6 217.6 0 1 0 435.2 0 217.6 217.6 0 1 0-435.2 0Z' fill='#F3C02C' />
          <Path
            d='M339.2 582.4v32h57.6v51.2h32v-51.2h57.6v-32h-57.6v-19.2h57.6v-32h-44.8l44.8-44.8-19.2-25.6-51.2 57.6-57.6-57.6-19.2 25.6 44.8 44.8h-44.8v32h57.6v19.2z'
            fill='#FFFFFF'
          />
        </G>
      </Svg>
    )
  }
]
export default function NotificationsScreen() {
  const router = useRouter()
  // const { isAuthenticated } = useAuth()

  // if (!isAuthenticated) {
  //   return (
  //     <SafeAreaView>
  //       <Text>Please login to continue</Text>
  //     </SafeAreaView>
  //   )
  // }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-xl font-inter-semibold'>Notifications</Text>
        <View className='flex flex-row items-center gap-6 mr-1.5'>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Feather name='shopping-cart' size={22} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/chat')}>
            <Feather name='message-circle' size={22} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
        </View>
      </View>
      {notifications.map((notification, index) => {
        return (
          <TouchableOpacity key={notification.id}>
            <Separator />
            <NotificationCard notification={notification} />
            {index === notifications.length - 1 && <Separator />}
          </TouchableOpacity>
        )
      })}
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-sm font-inter-medium'>All notifications</Text>
        <Text className='text-xs text-muted-foreground'>Mark all as read</Text>
      </View>
    </SafeAreaView>
  )
}

function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <View className='flex flex-row items-center gap-4 px-4 py-4'>
      <View className='border-2 border-muted rounded-full'>{notification.icon}</View>
      <View className='flex flex-col items-start flex-1'>
        <Text className='text-sm font-inter-semibold'>{notification.name}</Text>
        <Text className='text-muted-foreground text-xs'>{notification.description}</Text>
      </View>
      <Feather name='chevron-right' size={20} color='lightgray' />
    </View>
  )
}
