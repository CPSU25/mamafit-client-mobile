import { Dimensions, ImageStyle, StyleProp } from 'react-native'
import { CarouselRenderItem } from 'react-native-reanimated-carousel'
import { SlideItem } from '~/components/slide-item'

interface Options {
  rounded?: boolean
  style?: StyleProp<ImageStyle>
}

const renderItem = ({ rounded = false, style }: Options = {}): CarouselRenderItem<any> => {
  const windowWidth = Dimensions.get('window').width
  const padding = 32 // px-2 is equivalent to 16px (8px on each side)
  const fullWidth = windowWidth - padding

  const Component = ({ index }: { index: number }) => {
    const RenderItem = ({ index }: { index: number }) => (
      <SlideItem key={index} index={index} rounded={rounded} style={[style, { width: fullWidth }]} />
    )
    RenderItem.displayName = 'RenderItem'
    return <RenderItem index={index} />
  }
  Component.displayName = 'CarouselRenderItem'
  return Component
}

export { renderItem }
