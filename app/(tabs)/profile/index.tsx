import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import SignalRHealth from '~/components/signalr-health'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import { Text } from '~/components/ui/text'
import CurrentUser from '~/features/auth/components/current-user'
import { useAuth } from '~/hooks/use-auth'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

interface OrderStatus {
  id: number
  name: string
  url: string
  icon: React.ReactNode
}

const statuses: OrderStatus[] = [
  {
    id: 1,
    name: 'To Pay',
    url: '/order/to-pay',
    icon: SvgIcon.toPay({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  },
  {
    id: 2,
    name: 'To Ship',
    url: '/order/to-ship',
    icon: SvgIcon.toShip({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  },
  {
    id: 3,
    name: 'To Receive',
    url: '/order/to-receive',
    icon: SvgIcon.toReceive({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  },
  {
    id: 4,
    name: 'To Rate',
    url: '/order/to-rate',
    icon: SvgIcon.toRate({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  }
]

function OrderStage({ status }: { status: OrderStatus }) {
  return (
    <View className='flex flex-col gap-2 items-center'>
      {status.icon}
      <Text className='text-xs'>{status.name}</Text>
    </View>
  )
}

export default function ProfileScreen() {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { isDarkColorScheme, setColorScheme } = useColorScheme()
  const [checked, setChecked] = useState(isDarkColorScheme ? true : false)
  const toggleColorScheme = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark'
    setColorScheme(newTheme)
    setChecked((prev) => !prev)
  }

  if (isLoading) return <Loading />

  return (
    <SafeView>
      <View className='flex flex-row items-center justify-between p-4'>
        <CurrentUser />
        {isAuthenticated ? (
          <View className='flex flex-row items-center gap-6 mr-2'>
            <TouchableOpacity onPress={() => router.push('/setting')}>
              <Feather name='settings' size={24} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/cart')}>
              <Feather name='shopping-bag' size={24} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/chat')}>
              <Feather name='message-circle' size={24} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className='flex flex-row items-center gap-2'>
            <Button className='w-32' variant='outline' onPress={() => router.push('/auth?focus=sign-in')} size='sm'>
              <Text className='font-inter-medium'>Sign In</Text>
            </Button>
            <Button className='w-32' variant='default' onPress={() => router.push('/auth?focus=register')} size='sm'>
              <Text className='font-inter-medium'>Register</Text>
            </Button>
          </View>
        )}
      </View>
      <View className='bg-muted h-2' />
      <View className='flex flex-row items-baseline justify-between p-4 mb-2'>
        <Text className='font-inter-medium'>My Purchases</Text>
        <TouchableOpacity className='flex flex-row items-start'>
          <Text className='text-xs text-muted-foreground mr-0.5'>View Purchase History</Text>
          <Feather name='chevron-right' size={18} color='lightgray' />
        </TouchableOpacity>
      </View>
      <View className='flex flex-row items-center justify-around mb-6'>
        {statuses.map((status) => (
          <TouchableOpacity key={status.id} onPress={() => router.push(status.url as any)}>
            <OrderStage status={status} />
          </TouchableOpacity>
        ))}
      </View>

      <View className='bg-muted h-2' />

      <TouchableOpacity className='flex-row items-center p-4' onPress={() => router.push('/profile/appointment')}>
        <Feather name='calendar' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5'>My Appointments</Text>
        <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity className='flex-row items-center p-4'>
        <Feather name='percent' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5'>My Vouchers</Text>
        <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>
      <Separator />
      <Pressable className='flex-row items-center p-4' onPress={toggleColorScheme}>
        <Feather name='moon' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5 flex-1'>Dark Mode</Text>
        <Switch checked={checked} onCheckedChange={toggleColorScheme} />
      </Pressable>

      <SignalRHealth />
    </SafeView>
  )
}
