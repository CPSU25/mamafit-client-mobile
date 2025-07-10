import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ImageProps, StyleSheet, View } from 'react-native'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

interface AutoHeightImageProps extends ImageProps {
  uri: string
  width: number
}

export default function AutoHeightImage({ uri, width, style, ...props }: AutoHeightImageProps) {
  const [height, setHeight] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <View
      style={[
        { width, height },
        { justifyContent: 'center', alignItems: 'center' }
      ]}
    >
      <Image
        source={{ uri }}
        style={[{ width, height, resizeMode: 'cover' }, style]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        {...props}
      />
      {isLoading && (
        <View style={StyleSheet.absoluteFill} pointerEvents='none'>
          <ActivityIndicator color={PRIMARY_COLOR.LIGHT} className='flex-1' />
        </View>
      )}
    </View>
  )
}
