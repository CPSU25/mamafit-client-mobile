import { getDownloadURL, getStorage, putFile, ref } from '@react-native-firebase/storage'
import { ImagePickerAsset } from 'expo-image-picker'
import { Platform } from 'react-native'
import { generateImageFileName } from '~/lib/utils'

class FirebaseService {
  async uploadImages(
    assets: ImagePickerAsset[],
    path: string,
    onProgress?: (progress: number, assetIndex: number) => void
  ) {
    if (!assets || assets.length === 0) {
      throw new Error('No assets provided for upload')
    }

    const successfulUploads: string[] = []
    const errors: string[] = []

    for (let i = 0; i < assets.length; i++) {
      try {
        const url = await this.uploadSingleImage(assets[i], path, (progress) => {
          if (onProgress) onProgress(progress, i)
        })
        successfulUploads.push(url)
      } catch (err: any) {
        console.error(`Failed to upload image ${i + 1}:`, err)
        errors.push(`Image ${i + 1}: ${err.message || 'Upload failed'}`)
      }
    }

    if (successfulUploads.length === 0) {
      throw new Error(`All uploads failed: ${errors.join(', ')}`)
    }
    if (errors.length > 0) {
      console.warn(`Some uploads failed: ${errors.join(', ')}`)
    }

    return successfulUploads
  }

  async uploadSingleImage(asset: ImagePickerAsset, path: string, onProgress?: (progress: number) => void) {
    if (!asset.uri) {
      throw new Error('Asset URI is required for upload')
    }

    const extension = this.getFileExtension(asset.uri, asset.mimeType)
    const filename = asset.fileName || generateImageFileName(extension.replace('.', ''))
    const uploadPath = `${path}/${filename}`

    const uploadUri = Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri

    const storage = getStorage()
    const storageRef = ref(storage, uploadPath)

    return new Promise<string>((resolve, reject) => {
      const task = putFile(storageRef, uploadUri)

      // Listen to progress
      task.on(
        'state_changed',
        (snapshot: any) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          if (onProgress) onProgress(progress)
        },
        (error: any) => reject(error),
        async () => {
          try {
            const downloadUrl = await getDownloadURL(storageRef)
            resolve(downloadUrl)
          } catch (err) {
            reject(err)
          }
        }
      )
    })
  }

  async uploadVideos(assets: ImagePickerAsset[], path: string) {
    if (!assets || assets.length === 0) {
      throw new Error('No assets provided for upload')
    }

    try {
      const uploadPromises = assets.map((asset) => this.uploadSingleVideo(asset, path))
      const results = await Promise.allSettled(uploadPromises)

      const successfulUploads: string[] = []
      const errors: string[] = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulUploads.push(result.value)
        } else {
          console.error(`Failed to upload video ${index + 1}:`, result.reason)
          errors.push(`Video ${index + 1}: ${result.reason.message || 'Upload failed'}`)
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
      console.error('Error in uploadVideos:', error)
      throw new Error(`Failed to upload videos: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async uploadSingleVideo(asset: ImagePickerAsset, path: string, onProgress?: (progress: number) => void) {
    if (!asset.uri) {
      throw new Error('Asset URI is required for upload')
    }

    const extension = this.getVideoExtension(asset.uri, asset.mimeType)
    const filename = asset.fileName || generateImageFileName(extension.replace('.', ''))
    const uploadPath = `${path}/${filename}`

    const uploadUri = Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri

    const storage = getStorage()
    const storageRef = ref(storage, uploadPath)

    try {
      return new Promise<string>((resolve, reject) => {
        const task = putFile(storageRef, uploadUri)

        // Listen to progress
        task.on(
          'state_changed',
          (snapshot: any) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            if (onProgress) onProgress(progress)
          },
          (error: any) => reject(error),
          async () => {
            try {
              const downloadUrl = await getDownloadURL(storageRef)
              resolve(downloadUrl)
            } catch (err) {
              reject(err)
            }
          }
        )
      })
    } catch (error) {
      console.error('Error uploading single video:', error)

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

  private getVideoExtension(uri: string, mimeType?: string): string {
    const uriExtension = uri.split('.').pop()?.toLowerCase()
    if (uriExtension && ['mp4', 'mov', 'm4v', '3gp', 'avi', 'mkv', 'webm'].includes(uriExtension)) {
      return `.${uriExtension}`
    }

    if (mimeType) {
      const mimeToExt: { [key: string]: string } = {
        'video/mp4': '.mp4',
        'video/quicktime': '.mov',
        'video/x-m4v': '.m4v',
        'video/3gpp': '.3gp',
        'video/x-msvideo': '.avi',
        'video/x-matroska': '.mkv',
        'video/webm': '.webm'
      }
      return mimeToExt[mimeType] || '.mp4'
    }

    return '.mp4'
  }
}

const firebaseService = new FirebaseService()
export default firebaseService
