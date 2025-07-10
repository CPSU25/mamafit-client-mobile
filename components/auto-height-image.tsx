import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ImageProps, ImageSourcePropType, StyleSheet, View } from 'react-native'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

interface AutoHeightImageProps extends Omit<ImageProps, 'source'> {
  uri?: string
  source?: ImageSourcePropType
  width: number
}

export default function AutoHeightImage({ uri, source, width, style, ...props }: AutoHeightImageProps) {
  const [height, setHeight] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (uri) {
      // Remote image
      Image.getSize(
        uri,
        (originalWidth, originalHeight) => {
          if (isMounted) {
            const ratio = originalHeight / originalWidth
            setHeight(width * ratio)
          }
        },
        (error) => {
          if (isMounted) {
            console.warn('Failed to get image size:', error)
            setHeight(width) // fallback: square
          }
        }
      )
    } else if (source) {
      // Local image
      const resolved = Image.resolveAssetSource(source)
      if (resolved?.width && resolved?.height) {
        const ratio = resolved.height / resolved.width
        setHeight(width * ratio)
      } else {
        setHeight(width) // fallback: square
      }
    } else {
      setHeight(null)
    }

    return () => {
      isMounted = false
    }
  }, [uri, source, width])

  if (height === null) return <View style={{ width, height: 0 }} />

  return (
    <View
      style={[
        { width, height },
        { justifyContent: 'center', alignItems: 'center' }
      ]}
    >
      <Image
        source={uri ? { uri } : source!}
        style={[{ width, height, resizeMode: 'cover' }, style]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        {...props}
      />
      {isLoading && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents='none'>
          <ActivityIndicator color={PRIMARY_COLOR.LIGHT} style={{ flex: 1 }} />
        </View>
      )}
    </View>
  )
}
