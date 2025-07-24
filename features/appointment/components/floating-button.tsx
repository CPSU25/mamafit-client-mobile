import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useMemo } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface FloatingButtonProps {
  animatedPosition: SharedValue<number>
  animatedIndex: SharedValue<number>
  onPress: () => void
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function FloatingButton({ animatedPosition, animatedIndex, onPress }: FloatingButtonProps) {
  const { bottom: bottomSafeArea } = useSafeAreaInsets()

  const lockedYPosition = useMemo(() => SCREEN_HEIGHT - 80 - 298 - bottomSafeArea, [bottomSafeArea])

  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: animatedPosition.value - 24
        },
        {
          scale: interpolate(animatedIndex.value, [0, 2], [1, 1], Extrapolation.CLAMP)
        }
      ]
    }),
    [lockedYPosition]
  )

  const containerStyle = useMemo(() => [styles.container, containerAnimatedStyle], [containerAnimatedStyle])

  return (
    <Animated.View style={containerStyle}>
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          colors={['#5b21b6', '#7c3aed', '#8b5cf6']}
          className='rounded-full overflow-hidden p-3'
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            boxShadow: '0 0 10px 0 rgba(109, 40, 217, 0.6)'
          }}
        >
          <MaterialIcons name='my-location' size={24} color='white' />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    top: -40,
    borderRadius: 4,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  }
})
