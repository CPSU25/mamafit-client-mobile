import Animated from 'react-native-reanimated'
import React, { useMemo } from 'react'
import {
  ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  StyleSheet,
  TouchableOpacity,
  type ViewProps
} from 'react-native'
import type { AnimatedProps } from 'react-native-reanimated'

interface Props extends AnimatedProps<ViewProps> {
  style?: StyleProp<ImageStyle>
  index?: number
  rounded?: boolean
  source?: ImageSourcePropType
}

export const IMAGES = [
  require('~/assets/images/mamafit-app-icon.png'),
  require('~/assets/images/mamafit-app-icon.png'),
  require('~/assets/images/mamafit-app-icon.png'),
  require('~/assets/images/mamafit-app-icon.png'),
  require('~/assets/images/mamafit-app-icon.png'),
  require('~/assets/images/mamafit-app-icon.png')
]

export const SlideItem: React.FC<Props> = (props) => {
  const { style, index = 0, rounded = false, testID, ...animatedViewProps } = props

  const source = useMemo(() => props.source || IMAGES[index % IMAGES.length], [index, props.source])

  return (
    <Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
      <TouchableOpacity>
        <Animated.Image
          style={[style, styles.container, rounded && { borderRadius: 15 }]}
          source={source}
          resizeMode='cover'
        />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  }
})
