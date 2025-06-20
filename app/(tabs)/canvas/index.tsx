import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import HeroSection from '~/features/design-request/components/hero-section'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function CanvasScreen() {
  const router = useRouter()

  return (
    <SafeAreaView className='flex-1'>
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
    </SafeAreaView>
  )
}
