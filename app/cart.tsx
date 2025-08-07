import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

export default function CartScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { bottom } = useSafeAreaInsets()
  const [checkAll, setCheckAll] = useState(false)

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const cartItems = []

  return (
    <SafeView>
      <View className='flex flex-row items-center justify-between p-4'>
        <View className='flex flex-row items-center gap-4'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-semibold text-xl'>Shopping Cart</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/chat')}>
          <Feather name='message-circle' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>
      <View className='bg-muted h-2' />

      <View className='flex-1 p-4'>
        {cartItems.length > 0 ? (
          <Text>Cart items will go here</Text>
        ) : (
          <View className='flex-1 items-center mt-48'>
            {SvgIcon.cart({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
            <Text className='text-muted-foreground text-sm mt-2'>Empty cart</Text>
          </View>
        )}
      </View>
      <View
        className='absolute bottom-0 left-0 right-0 bg-background border-t border-border'
        style={{
          paddingBottom: bottom
        }}
      >
        <View className='flex flex-row items-center gap-4 p-4'>
          <Feather name='dollar-sign' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='text-sm font-inter-medium'>Total</Text>
          <Text className='font-inter-semibold text-lg text-primary ml-auto'>
            <Text className='underline font-inter-semibold text-primary'>đ</Text>3.860.000
          </Text>
        </View>
        <Separator />
        <View className='flex flex-row justify-between items-center p-4'>
          <View className='flex flex-row items-center gap-4'>
            <Checkbox checked={checkAll} onCheckedChange={setCheckAll} />
            <Text className='text-sm font-inter-medium'>All</Text>
          </View>
          <Button onPress={() => router.push('/order/review')}>
            <Text className='text-white text-center font-inter-medium'>Check Out (2)</Text>
          </Button>
        </View>
      </View>
    </SafeView>
  )
}
