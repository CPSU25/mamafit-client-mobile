import { Feather } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import { Alert, Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { validateImageConstraints } from '~/lib/utils'
import firebaseService from '~/services/firebase.service'
import { Text } from './text'

interface ImagePickerComponentProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  maxSizeInMB?: number
  placeholder?: string
}

const MAX_IMAGES = 5
const MAX_FILE_SIZE_MB = 5
const MAX_DIMENSION = 1920

export function ImagePickerComponent({
  images,
  onImagesChange,
  maxImages = MAX_IMAGES,
  maxSizeInMB = MAX_FILE_SIZE_MB,
  placeholder = 'Add images'
}: ImagePickerComponentProps) {
  const [isUploading, setIsUploading] = useState(false)

  const validateImageSize = (asset: ImagePicker.ImagePickerAsset): boolean => {
    const validation = validateImageConstraints(asset.fileSize, asset.width, asset.height, maxSizeInMB, MAX_DIMENSION)

    if (!validation.isValid) {
      Alert.alert('Invalid Image', validation.error || 'Image does not meet requirements')
      return false
    }

    return true
  }

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
        allowsMultipleSelection: true,
        selectionLimit: maxImages - images.length
      })

      if (result.canceled) return

      setIsUploading(true)

      // Validate images before upload
      const validAssets = result.assets.filter(validateImageSize)

      if (validAssets.length === 0) {
        setIsUploading(false)
        return
      }

      if (validAssets.length < result.assets.length) {
        Alert.alert(
          'Some Images Skipped',
          `${result.assets.length - validAssets.length} image(s) were skipped due to size limits.`
        )
      }

      const urls = await firebaseService.uploadImages(validAssets)
      onImagesChange([...images, ...urls])
    } catch (error) {
      console.error('Error picking images:', error)
      Alert.alert('Error', 'Failed to pick images. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(updatedImages)
  }

  const resetImages = () => {
    Alert.alert('Clear All Images', 'Are you sure you want to remove all images?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => onImagesChange([]) }
    ])
  }

  const isMaxReached = images.length >= maxImages

  return (
    <View className='flex flex-col gap-4'>
      <View
        className={`flex flex-col gap-4 p-2 border border-dashed rounded-2xl ${
          images.length >= maxImages ? 'border-rose-200 bg-rose-50/50' : 'border-input bg-muted/20'
        }`}
      >
        {!isMaxReached ? (
          <TouchableOpacity
            disabled={isUploading}
            onPress={pickImage}
            className='flex flex-col items-center justify-center gap-2'
          >
            {SvgIcon.galleryImport({ size: ICON_SIZE.LARGE, color: 'GRAY' })}
            <Text className='text-xs font-medium text-muted-foreground'>
              {isUploading
                ? 'Uploading...'
                : images.length > 0
                  ? `${images.length} / ${maxImages} images selected. Tap to add more.`
                  : placeholder}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className='flex flex-col items-center justify-center gap-2'>
            <Feather name='alert-circle' size={40} color='#f43f5e' />
            <Text className='text-xs font-medium text-rose-600'>
              Max {maxImages} images reached. Remove some to add more.
            </Text>
          </View>
        )}

        {/* Images Grid */}
        {images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex flex-row gap-2'>
              {images.map((imageUri, index) => (
                <View key={`${imageUri}-${index}`} className='relative'>
                  <View className='p-1'>
                    <Image
                      source={{ uri: imageUri }}
                      className='w-24 h-24 rounded-xl border border-border'
                      resizeMode='cover'
                    />
                    <Pressable
                      onPress={() => removeImage(index)}
                      className='absolute top-0 right-0 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-lg border border-white'
                    >
                      <Feather name='x' size={12} color='white' />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {isMaxReached && (
          <TouchableOpacity
            onPress={resetImages}
            className='flex flex-row items-center justify-center gap-2 p-3 bg-rose-100 rounded-xl'
          >
            <Feather name='refresh-cw' size={16} color='#f43f5e' />
            <Text className='text-sm font-medium text-rose-600'>Clear all images</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
