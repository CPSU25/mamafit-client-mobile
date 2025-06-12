import { useRef } from 'react'
import { Dimensions, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { renderItem } from '~/lib/render-item'

const defaultDataWith6Colors = ['#B0604D', '#899F9C', '#B3C680', '#5C6265', '#F5D399', '#F1F1F1']

export default function HomeCarousel() {
  const progress = useSharedValue<number>(0)
  const windowWidth = Dimensions.get('window').width
  const padding = 16
  const fullWidth = windowWidth - padding
  const ref = useRef<ICarouselInstance>(null)

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true
    })
  }

  return (
    <View className='relative'>
      <Carousel
        ref={ref}
        testID={'carousel'}
        loop={true}
        width={fullWidth}
        height={190}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlay={true}
        autoPlayInterval={7000}
        data={defaultDataWith6Colors}
        onProgressChange={progress}
        renderItem={renderItem({ rounded: true })}
      />
      <View className='absolute bottom-2 left-0 right-0 z-50'>
        <Pagination.Basic
          progress={progress}
          data={defaultDataWith6Colors}
          dotStyle={{
            width: 6,
            height: 6,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
          activeDotStyle={{
            width: 6,
            height: 6,
            borderRadius: 4,
            backgroundColor: PRIMARY_COLOR.LIGHT
          }}
          containerStyle={{
            gap: 6,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={onPressPagination}
        />
      </View>
    </View>
  )
}
