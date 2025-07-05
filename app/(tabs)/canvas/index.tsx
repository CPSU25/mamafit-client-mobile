import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import HeroSection from '~/features/design-request/components/hero-section'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function CanvasScreen() {
  const router = useRouter()

  return (
    <SafeView>
      {/* Header */}
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-xl font-inter-semibold'>Design Your Dress</Text>
        <TouchableOpacity onPress={() => router.push('/canvas/create')}>
          <Feather name='plus' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>
      <View className='bg-muted h-2' />

      <View className='flex flex-col gap-4 p-4'>
        <HeroSection />
      </View>

      <Button onPress={() => router.push('/payment/1ba3978201ee479d855d6cbd10dcf780/qr-code')}>
        <Text className='font-inter-medium'>Checkout</Text>
      </Button>
    </SafeView>
  )
}
