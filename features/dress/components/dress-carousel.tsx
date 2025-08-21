import { useState } from 'react'
import { Dimensions, Image, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

interface DressCarouselProps {
  images: string[]
}

const windowWidth = Dimensions.get('window').width

export default function DressCarousel({ images }: DressCarouselProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  return (
    <View className='relative'>
      <Carousel
        autoPlayInterval={15 * 1000}
        autoPlay={true}
        data={images}
        height={480}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={windowWidth}
        style={{ width: windowWidth }}
        onSnapToItem={(index) => setActiveImageIndex(index)}
        renderItem={({ item }) => (
          <View
            style={{
              width: windowWidth,
              height: 480,
              overflow: 'hidden'
            }}
          >
            <Image
              source={typeof item === 'string' ? { uri: item } : undefined}
              style={{
                width: '100%',
                height: '180%',
                position: 'absolute',
                top: 0,
                left: 0
              }}
              resizeMode='cover'
            />
          </View>
        )}
      />
      {!!(images && images.length > 1) && (
        <View className='absolute left-0 right-0 flex-row items-center justify-center' style={{ bottom: 8 }}>
          {images.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                marginHorizontal: 4,
                backgroundColor: idx === activeImageIndex ? 'white' : 'rgba(255,255,255,0.5)'
              }}
            />
          ))}
        </View>
      )}
    </View>
  )
}
