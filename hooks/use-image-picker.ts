import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Alert } from 'react-native'
import { validateImageConstraints } from '~/lib/utils'
import firebaseService from '~/services/firebase.service'

interface UseImagePickerOptions {
  maxImages?: number
  maxSizeInMB?: number
  maxDimension?: number
  initialImages?: string[]
}

const DEFAULT_MAX_IMAGES = 5
const DEFAULT_MAX_SIZE_MB = 5
const DEFAULT_MAX_DIMENSION = 1920

export function useImagePicker({
  maxImages = DEFAULT_MAX_IMAGES,
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  maxDimension = DEFAULT_MAX_DIMENSION,
  initialImages = []
}: UseImagePickerOptions = {}) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)

  const validateImageSize = (asset: ImagePicker.ImagePickerAsset): boolean => {
    const validation = validateImageConstraints(asset.fileSize, asset.width, asset.height, maxSizeInMB, maxDimension)

    if (!validation.isValid) {
      Alert.alert('Invalid Image', validation.error || 'Image does not meet requirements')
      return false
    }

    return true
  }

  const pickImages = async (path?: string): Promise<string[]> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!')
        return []
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
        allowsMultipleSelection: true,
        selectionLimit: maxImages - images.length
      })

      if (result.canceled) return []

      setIsUploading(true)

      // Validate images before upload
      const validAssets = result.assets.filter(validateImageSize)

      if (validAssets.length === 0) {
        setIsUploading(false)
        return []
      }

      if (validAssets.length < result.assets.length) {
        Alert.alert(
          'Some Images Skipped',
          `${result.assets.length - validAssets.length} image(s) were skipped due to size limits.`
        )
      }

      const urls = await firebaseService.uploadImages(validAssets, path)
      const newImages = [...images, ...urls]
      setImages(newImages)

      return urls
    } catch (error) {
      console.error('Error picking images:', error)
      Alert.alert('Error', 'Failed to pick images. Please try again.')
      return []
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    setImages(updatedImages)
  }

  const resetImages = () => {
    Alert.alert('Clear All Images', 'Are you sure you want to remove all images?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setImages([]) }
    ])
  }

  const updateImages = (newImages: string[]) => {
    setImages(newImages)
  }

  return {
    images,
    isUploading,
    pickImages,
    removeImage,
    resetImages,
    updateImages,
    isMaxReached: images.length >= maxImages,
    remainingSlots: Math.max(0, maxImages - images.length)
  }
}
