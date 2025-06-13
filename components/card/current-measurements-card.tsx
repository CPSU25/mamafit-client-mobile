import { BlurView } from 'expo-blur'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { getShadowStyles, styles } from '~/lib/constants/constants'

export default function CurrentMeasurementsCard() {
  return (
    <Animated.View
      entering={FadeInDown.delay(100)}
      className='relative w-full h-[128px] rounded-2xl overflow-hidden'
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
            <Text className='text-white text-2xl font-inter-bold'>60kg</Text>
          </View>
          <View className='gap-0.5'>
            <Text className='text-white/80 text-xs font-inter-medium tracking-wide'>Bust</Text>
            <Text className='text-white text-2xl font-inter-bold'>85cm</Text>
          </View>
          <View className='gap-0.5'>
            <Text className='text-white/80 text-xs font-inter-medium tracking-wide'>Waist</Text>
            <Text className='text-white text-2xl font-inter-bold'>65cm</Text>
          </View>
          <View className='gap-0.5'>
            <Text className='text-white/80 text-xs font-inter-medium tracking-wide'>Hip</Text>
            <Text className='text-white text-2xl font-inter-bold'>90cm</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} className='flex flex-row justify-between items-center'>
          <TouchableOpacity className='bg-white/10 rounded-xl px-4 py-2'>
            <Text className='text-white text-xs font-inter-semibold'>Press to edit now!</Text>
          </TouchableOpacity>
          <Text className='text-white text-xs font-inter-medium'>updated 12 hours ago</Text>
        </Animated.View>
      </View>
    </Animated.View>
  )
}
