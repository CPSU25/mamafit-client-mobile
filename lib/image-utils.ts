import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

/**
 * Image optimization utilities for React Native
 */
export class ImageUtils {
  /**
   * Generate optimized image URL with proper dimensions and format
   */
  static getOptimizedImageUrl(
    baseUrl: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'jpeg' | 'png'
    } = {}
  ): string {
    const {
      width = SCREEN_WIDTH / 2, // Default to half screen width for grid items
      height,
      quality = 80,
      format = 'webp'
    } = options

    // For external URLs, try to append optimization parameters
    // This works with many CDNs like Cloudinary, ImageKit, etc.
    const url = new URL(baseUrl)

    // Common CDN optimization parameters
    const params = new URLSearchParams()
    params.set('w', Math.round(width).toString())
    if (height) params.set('h', Math.round(height).toString())
    params.set('q', quality.toString())
    params.set('f', format)
    params.set('fit', 'crop')
    params.set('auto', 'format,compress')

    // For this specific Kate Backdrop URL, we'll modify it
    if (url.hostname.includes('katebackdrop.com')) {
      // Remove existing version parameter and add optimization
      url.searchParams.delete('v')
      // Add our optimization parameters
      params.forEach((value, key) => {
        url.searchParams.set(key, value)
      })
    }

    return url.toString()
  }

  /**
   * Generate multiple image sizes for responsive loading
   */
  static getResponsiveImageSizes(baseUrl: string) {
    const cardWidth = SCREEN_WIDTH / 2 - 24 // Account for padding and gaps

    return {
      thumbnail: this.getOptimizedImageUrl(baseUrl, {
        width: cardWidth * 0.5,
        quality: 60
      }),
      small: this.getOptimizedImageUrl(baseUrl, {
        width: cardWidth,
        quality: 75
      }),
      medium: this.getOptimizedImageUrl(baseUrl, {
        width: cardWidth * 1.5,
        quality: 85
      }),
      original: baseUrl
    }
  }

  /**
   * Generate blurhash placeholder for common image types
   */
  static getPlaceholderBlurhash(imageType: 'product' | 'avatar' | 'banner' = 'product'): string {
    const blurhashes = {
      product: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4', // Neutral product placeholder
      avatar: 'L4Rfq9ay0K%M?b%MxuWB4nayD%of', // Person-like placeholder
      banner: 'L8H2#^4n00M{~qj[IUj[8_ayWBay' // Landscape placeholder
    }

    return blurhashes[imageType]
  }

  /**
   * Preload critical images
   */
  static async preloadImages(urls: string[]): Promise<void> {
    const { Image } = await import('expo-image')

    const preloadPromises = urls.map((url) => Image.prefetch(url, { cachePolicy: 'memory-disk' }))

    await Promise.allSettled(preloadPromises)
  }
}

/**
 * Hook for lazy loading images based on scroll position
 */
export const useLazyImage = (imageUrl: string, threshold = 100) => {
  const [shouldLoad, setShouldLoad] = useState(false)

  // In a real implementation, you'd use Intersection Observer or scroll tracking
  // For now, we'll load images immediately but this structure allows for lazy loading
  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return {
    shouldLoad,
    optimizedUrl: shouldLoad ? ImageUtils.getOptimizedImageUrl(imageUrl) : null
  }
}
