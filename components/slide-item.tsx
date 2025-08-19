import React, { useMemo } from 'react'
import { ImageSourcePropType, type ImageStyle, type StyleProp, TouchableOpacity, type ViewProps } from 'react-native'
import type { AnimatedProps } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'

interface Props extends AnimatedProps<ViewProps> {
  style?: StyleProp<ImageStyle>
  index?: number
  rounded?: boolean
  source?: ImageSourcePropType
}

export const IMAGES = [
  require('~/assets/images/mamafit-banner-1.png'),
  require('~/assets/images/mamafit-banner-2.png'),
  require('~/assets/images/mamafit-banner-3.jpg'),
  require('~/assets/images/mamafit-banner-2.png'),
  require('~/assets/images/mamafit-banner-2.png'),
  require('~/assets/images/mamafit-banner-2.png')
]

export const SlideItem: React.FC<Props> = (props) => {
  const { style, index = 0, rounded = false, testID, ...animatedViewProps } = props

  const source = useMemo(() => props.source || IMAGES[index % IMAGES.length], [index, props.source])

  return (
    <Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
      <TouchableOpacity
        style={{ overflow: 'hidden', borderRadius: 16, boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.3)' }}
      >
        <Animated.Image
          style={[style, rounded && { borderRadius: 16 }, { width: '100%', height: '100%' }]}
          source={source}
          resizeMode='cover'
        />
      </TouchableOpacity>
    </Animated.View>
  )
}
