import { useEffect, useState } from 'react'
import { Dimensions, Image, ImageStyle, StyleProp, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import DressBuilder from '~/features/preset/components/dress-builder'
import { getShadowStyles, styles } from '~/lib/constants/constants'
import { PresetWithComponentOptions } from '~/types/preset.type'

type AutoHeightImageProps = {
  uri: string
  width: number
  style?: StyleProp<ImageStyle>
}

const AutoHeightImage = ({ uri, width, style }: AutoHeightImageProps) => {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    Image.getSize(
      uri,
      (originalWidth, originalHeight) => {
        const ratio = originalHeight / originalWidth
        setHeight(width * ratio)
      },
      (error) => {
        console.warn('Failed to get image size:', error)
      }
    )
  }, [uri, width])

  if (height === null) return <View style={{ width, height: 0 }} />

  return <Image source={{ uri }} style={[{ width, height, resizeMode: 'cover' }, style]} />
}

export default function CreateCanvasScreen() {
  const [preset, setPreset] = useState<PresetWithComponentOptions | null>(null)

  return (
    <SafeView className='bg-muted'>
      <View className='flex-1 relative'>
        <View className='absolute inset-0 z-50 top-0'>
          <DressBuilder setPreset={setPreset} />
        </View>

        <AutoHeightImage
          uri={
            preset?.images[0] ??
            'https://www.mirazwillinger.com/wp-content/uploads/2023/07/Zwilingers_25-06-23_0025-scaled.jpg'
          }
          width={Dimensions.get('window').width}
        />

        <View className='mx-4 mt-4 mb-2 gap-4 flex-1'>
          <Card className='p-2 flex-1' style={[styles.container, getShadowStyles()]}></Card>
          <Button>
            <Text className='font-inter-medium'>Check Out</Text>
          </Button>
        </View>
      </View>
    </SafeView>
  )
}
