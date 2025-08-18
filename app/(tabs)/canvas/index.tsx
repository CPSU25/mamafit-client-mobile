import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import HeroSection from '~/features/design-request/components/hero-section'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function CanvasScreen() {
  const router = useRouter()

  return (
    <SafeView>
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-xl font-inter-medium'>Thiết kế váy bầu</Text>
        <TouchableOpacity onPress={() => router.push('/canvas/create')}>
          <Feather name='plus' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>
      <View className='bg-muted h-2' />

      <View className='p-4 flex-col gap-4'>
        <HeroSection />
      </View>
    </SafeView>
  )
}
