import { Feather } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import { Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Text } from './text'

interface ImagePickerComponentProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  placeholder?: string
}

export function ImagePickerComponent({
  images,
  onImagesChange,
  maxImages = 5,
  placeholder = 'Add images'
}: ImagePickerComponentProps) {
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.8,
      allowsMultipleSelection: true
    })

    // TODO: Add cloudinary upload
    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri)
      const updatedImages = [...images, ...newImages].slice(0, maxImages)
      onImagesChange(updatedImages)
    }
  }

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(updatedImages)
  }

  const resetImages = () => {
    onImagesChange([])
  }

  return (
    <View className='flex flex-col gap-4'>
      <View
        className={`flex flex-col gap-4 p-2 border border-dashed rounded-2xl ${
          images.length >= maxImages ? 'border-rose-200 bg-rose-50/50' : 'border-input bg-muted/20'
        }`}
      >
        {images.length < maxImages ? (
          <TouchableOpacity onPress={pickImage} className='flex flex-col items-center justify-center gap-2'>
            {SvgIcon.galleryImport({ size: ICON_SIZE.LARGE, color: 'GRAY' })}
            <Text className='text-xs font-medium text-muted-foreground'>
              {images.length > 0 ? `${images.length} / ${maxImages} images selected. Tap to add more.` : placeholder}
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
          <View className='mt-2'>
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
          </View>
        )}

        {images.length >= maxImages && (
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
