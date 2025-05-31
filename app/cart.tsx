import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { G, Path } from 'react-native-svg'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants'

export default function CartScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { bottom } = useSafeAreaInsets()
  const [checkAll, setCheckAll] = useState(false)

  if (!isAuthenticated && !isLoading) return <Redirect href='/auth?focus=sign-in' />

  const handleGoBack = () => {
    router.back()
  }

  const cartItems = []

  return (
    <SafeAreaView className='flex-1'>
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
            <Svg width={ICON_SIZE.EXTRA_LARGE} height={ICON_SIZE.EXTRA_LARGE} viewBox='0 0 24 24' fill='none'>
              <G id='SVGRepo_bgCarrier' stroke-width='0'></G>
              <G id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></G>
              <G id='SVGRepo_iconCarrier'>
                <Path
                  d='M16.25 22.5C17.2165 22.5 18 21.7165 18 20.75C18 19.7835 17.2165 19 16.25 19C15.2835 19 14.5 19.7835 14.5 20.75C14.5 21.7165 15.2835 22.5 16.25 22.5Z'
                  fill='#C4C8CC'
                ></Path>
                <Path
                  d='M8.25 22.5C9.2165 22.5 10 21.7165 10 20.75C10 19.7835 9.2165 19 8.25 19C7.2835 19 6.5 19.7835 6.5 20.75C6.5 21.7165 7.2835 22.5 8.25 22.5Z'
                  fill='#C4C8CC'
                ></Path>
                <Path
                  opacity='0.4'
                  d='M4.84 3.94L4.64 6.39C4.6 6.86 4.97 7.25 5.44 7.25H20.75C21.17 7.25 21.52 6.92999 21.55 6.50999C21.68 4.73999 20.33 3.3 18.56 3.3H6.28999C6.18999 2.86 5.98999 2.44 5.67999 2.09C5.18999 1.56 4.49 1.25 3.77 1.25H2C1.59 1.25 1.25 1.59 1.25 2C1.25 2.41 1.59 2.75 2 2.75H3.74001C4.05001 2.75 4.34 2.88001 4.55 3.10001C4.76 3.33001 4.86 3.63 4.84 3.94Z'
                  fill='#C4C8CC'
                ></Path>
                <Path
                  d='M20.5101 8.75H5.17006C4.75006 8.75 4.41005 9.07 4.37005 9.48L4.01005 13.83C3.87005 15.53 5.21006 17 6.92006 17H18.0401C19.5401 17 20.8601 15.77 20.9701 14.27L21.3001 9.60001C21.3401 9.14001 20.9801 8.75 20.5101 8.75Z'
                  fill='#C4C8CC'
                ></Path>
              </G>
            </Svg>
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
        <TouchableOpacity className='flex flex-row items-center gap-4 p-4'>
          <Feather name='shopping-bag' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='text-sm font-inter-medium'>MamaFit Vouchers</Text>
          <Feather name='chevron-right' size={20} color={PRIMARY_COLOR.LIGHT} className='ml-auto' />
        </TouchableOpacity>
        <Separator />
        <View className='flex flex-row justify-between items-center p-4'>
          <View className='flex flex-row items-center gap-4'>
            <Checkbox checked={checkAll} onCheckedChange={setCheckAll} />
            <Text className='text-sm font-inter-medium'>All</Text>
          </View>
          <Button>
            <Text className='text-white text-center font-inter-medium'>Check Out (2)</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
