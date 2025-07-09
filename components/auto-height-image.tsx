import { useEffect, useState } from 'react'
import { Image, ImageStyle, StyleProp, View } from 'react-native'

type AutoHeightImageProps = {
  uri: string
  width: number
  style?: StyleProp<ImageStyle>
}

export default function AutoHeightImage({ uri, width, style }: AutoHeightImageProps) {
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
