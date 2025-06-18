import { formatDistanceToNow } from 'date-fns'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { getShadowStyles, styles } from '~/lib/constants/constants'
import { Measurement } from '~/types/diary.type'

interface CurrentMeasurementsCardProps {
  measurement: Measurement | undefined
  diaryId: string
}

export default function CurrentMeasurementsCard({ measurement, diaryId }: CurrentMeasurementsCardProps) {
  const router = useRouter()

  return (
    <Animated.View
      entering={FadeInDown.delay(100)}
      className='relative w-full h-[120px] rounded-2xl overflow-hidden'
      style={[styles.container, getShadowStyles()]}
    >
      <Image source={require('~/assets/images/mesh.jpg')} className='w-full h-full rounded-2xl absolute' />
      <BlurView
        intensity={40}
        tint='dark'
        className='absolute inset-0'
        style={{
          borderRadius: 16,
          overflow: 'hidden'
        }}
      />
      <View className='relative flex-1 p-4 justify-between'>
        <Animated.View entering={FadeInDown.delay(300)} className='flex flex-row justify-between'>
          <View className='gap-0.5'>
            <Text className='text-white/80 text-xs font-inter-medium tracking-wide'>Weight</Text>
            <Text className='text-white text-xl font-inter-bold'>{measurement?.weight || 'N/A'}kg</Text>
          </View>
          <View className='gap-0.5'>
            <Text className='text-white/80 text-xs font-inter-medium tracking-wide'>Bust</Text>
            <Text className='text-white text-xl font-inter-bold'>{measurement?.bust || 'N/A'}cm</Text>
          </View>
          <View className='gap-0.5'>
            <Text className='text-white/80 text-xs font-inter-medium tracking-wide'>Waist</Text>
            <Text className='text-white text-xl font-inter-bold'>{measurement?.waist || 'N/A'}cm</Text>
          </View>
          <View className='gap-0.5'>
            <Text className='text-white/80 text-xs font-inter-medium tracking-wide'>Hip</Text>
            <Text className='text-white text-xl font-inter-bold'>{measurement?.hip || 'N/A'}cm</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} className='flex flex-row justify-between items-center'>
          <TouchableOpacity
            onPress={() => router.push(`/diary/${diaryId}/history/${measurement?.id}`)}
            className='bg-white/10 rounded-xl px-3 py-2'
          >
            <Text className='text-white text-xs font-inter-semibold'>Press to edit now!</Text>
          </TouchableOpacity>
          <Text className='text-white text-xs font-inter-medium lowercase'>
            Updated {formatDistanceToNow(new Date(measurement?.updatedAt || ''))} ago
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  )
}
