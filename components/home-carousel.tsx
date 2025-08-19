import { Dimensions, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import { renderItem } from '~/lib/render-item'

const defaultDataWith6Colors = ['#B0604D', '#899F9C', '#B3C680', '#5C6265', '#F5D399', '#F1F1F1']

export default function HomeCarousel() {
  const progress = useSharedValue<number>(0)
  const windowWidth = Dimensions.get('window').width

  return (
    <View className='bg-background'>
      <Carousel
        autoPlayInterval={10 * 1000} // 10 seconds
        autoPlay={true}
        data={defaultDataWith6Colors}
        height={210}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={windowWidth}
        style={{
          width: windowWidth
        }}
        mode='parallax'
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50
        }}
        onProgressChange={progress}
        renderItem={renderItem({ rounded: true })}
      />
    </View>
  )
}
