import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useMemo } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

interface FloatingButtonProps {
  animatedPosition: SharedValue<number>
  animatedIndex: SharedValue<number>
  isDisplayBottom: boolean
  onPressTop: () => void
  onPressBottom: () => void
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function FloatingButton({
  animatedPosition,
  animatedIndex,
  isDisplayBottom,
  onPressTop,
  onPressBottom
}: FloatingButtonProps) {
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      right: 12,
      top: isDisplayBottom ? -90 : -40,
      borderRadius: 4,
      zIndex: 10,
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  })

  const { bottom: bottomSafeArea } = useSafeAreaInsets()

  const lockedYPosition = useMemo(() => SCREEN_HEIGHT - 80 - 298 - bottomSafeArea, [bottomSafeArea])

  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: animatedPosition.value > lockedYPosition ? animatedPosition.value - 24 : lockedYPosition - 24
        },
        {
          scale: interpolate(animatedIndex.value, [1, 1.25], [1, 0], Extrapolation.CLAMP)
        }
      ]
    }),
    [lockedYPosition]
  )

  const containerStyle = useMemo(() => [styles.container, containerAnimatedStyle], [containerAnimatedStyle, styles])

  return (
    <Animated.View style={containerStyle}>
      <TouchableOpacity
        onPress={onPressTop}
        className='rounded-full bg-background overflow-hidden p-3'
        style={{
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
        }}
      >
        <MaterialIcons name='my-location' size={24} color={PRIMARY_COLOR.LIGHT} />
      </TouchableOpacity>

      {isDisplayBottom ? (
        <TouchableOpacity onPress={onPressBottom}>
          <LinearGradient
            colors={['#5b21b6', '#7c3aed', '#8b5cf6']}
            className='rounded-2xl overflow-hidden p-3'
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              boxShadow: '0 0 10px 0 rgba(109, 40, 217, 0.6)'
            }}
          >
            <MaterialIcons name='directions' size={24} color='white' />
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  )
}
