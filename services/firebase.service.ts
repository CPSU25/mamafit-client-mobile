import { getDownloadURL, getStorage, putFile, ref } from '@react-native-firebase/storage'
import { ImagePickerAsset } from 'expo-image-picker'
import { Platform } from 'react-native'
import { generateImageFileName } from '~/lib/utils'

const FILE_PATH = 'design-requests'
const UPLOAD_TIMEOUT = 30000

class FirebaseService {
  private filePath: string

  constructor(filePath: string = FILE_PATH) {
    this.filePath = filePath
  }

  async uploadImages(assets: ImagePickerAsset[], path?: string) {
    if (!assets || assets.length === 0) {
      throw new Error('No assets provided for upload')
    }

    try {
      const uploadPromises = assets.map((asset) => this.uploadSingleImage(asset, path))

      const results = await Promise.allSettled(uploadPromises)

      const successfulUploads: string[] = []
      const errors: string[] = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulUploads.push(result.value)
        } else {
          console.error(`Failed to upload image ${index + 1}:`, result.reason)
          errors.push(`Image ${index + 1}: ${result.reason.message || 'Upload failed'}`)
        }
      })

      if (successfulUploads.length === 0) {
        throw new Error(`All uploads failed: ${errors.join(', ')}`)
      }

      if (errors.length > 0) {
        console.warn(`Some uploads failed: ${errors.join(', ')}`)
      }

      return successfulUploads
    } catch (error) {
      console.error('Error in uploadImages:', error)
      throw new Error(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async uploadSingleImage(asset: ImagePickerAsset, path?: string) {
    if (!asset.uri) {
      throw new Error('Asset URI is required for upload')
    }

    try {
      // Generate unique filename and path
      const extension = this.getFileExtension(asset.uri, asset.mimeType)
      const filename = asset.fileName || generateImageFileName(extension.replace('.', ''))
      const uploadPath = `${path ? path : this.filePath}/${filename}`

      // Prepare URI for different platforms
      const uploadUri = Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri

      // Get Firebase storage reference
      const storage = getStorage()
      const storageRef = ref(storage, uploadPath)

      // Upload with timeout protection
      const uploadPromise = putFile(storageRef, uploadUri)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout')), UPLOAD_TIMEOUT)
      })

      await Promise.race([uploadPromise, timeoutPromise])

      // Get download URL
      const downloadUrl = await getDownloadURL(storageRef)

      if (!downloadUrl) {
        throw new Error('Failed to get download URL')
      }

      return downloadUrl
    } catch (error) {
      console.error('Error uploading single image:', error)

      if (error instanceof Error) {
        if (error.message.includes('network')) {
          throw new Error('Network error. Please check your connection and try again.')
        } else if (error.message.includes('timeout')) {
          throw new Error('Upload timed out. Please try again.')
        } else if (error.message.includes('storage/unauthorized')) {
          throw new Error('Upload not authorized. Please check your permissions.')
        } else if (error.message.includes('storage/quota-exceeded')) {
          throw new Error('Storage quota exceeded. Please contact support.')
        }
      }

      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private getFileExtension(uri: string, mimeType?: string): string {
    const uriExtension = uri.split('.').pop()?.toLowerCase()
    if (uriExtension && ['jpg', 'jpeg', 'png', 'webp'].includes(uriExtension)) {
      return `.${uriExtension}`
    }

    if (mimeType) {
      const mimeToExt: { [key: string]: string } = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp'
      }
      return mimeToExt[mimeType] || '.jpg'
    }

    return '.jpg'
  }
}

const firebaseService = new FirebaseService()
export default firebaseService
