/**
 * Modular Image Picker System
 *
 * This system provides multiple ways to handle image picking, upload, and UI:
 *
 * 1. useImagePicker Hook (Logic Only):
 *    ```tsx
 *    const { images, pickImages, removeImage, isUploading } = useImagePicker({
 *      maxImages: 5,
 *      maxSizeInMB: 2
 *    })
 *
 *    const handlePick = async () => {
 *      const urls = await pickImages() // Returns uploaded URLs
 *    }
 *    ```
 *
 * 2. Individual UI Components:
 *    ```tsx
 *    <ImagePickerTrigger onPress={handlePick} isUploading={isUploading} ... />
 *    <ImageGrid images={images} onRemoveImage={removeImage} />
 *    <ImageResetButton onReset={resetImages} />
 *    ```
 *
 * 3. Complete ImagePickerComponent (Backward Compatible):
 *    ```tsx
 *    <ImagePickerComponent
 *      images={images}
 *      onImagesChange={setImages}
 *      maxImages={5}
 *    />
 *    ```
 *
 * 4. Form Integration:
 *    ```tsx
 *    const currentImages = watch('images')
 *    const { pickImages } = useImagePicker({ initialImages: currentImages })
 *
 *    const handlePick = async () => {
 *      const urls = await pickImages()
 *      setValue('images', [...currentImages, ...urls])
 *    }
 *    ```
 */

import { AlertCircle, RefreshCcw, X } from 'lucide-react-native'
import React from 'react'
import { Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import { useImagePicker } from '~/hooks/use-image-picker'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { Icon } from './icon'
import { Text } from './text'

// UI Component for the image picker trigger
interface ImagePickerTriggerProps {
  onPress: () => void
  isUploading: boolean
  isMaxReached: boolean
  currentCount: number
  maxImages: number
  placeholder?: string
}

export function ImagePickerTrigger({
  onPress,
  isUploading,
  isMaxReached,
  currentCount,
  maxImages,
  placeholder = 'Add images'
}: ImagePickerTriggerProps) {
  if (isMaxReached) {
    return (
      <View className='flex flex-col items-center justify-center gap-2'>
        <Icon as={AlertCircle} size={40} color='#f43f5e' />
        <Text className='text-xs font-medium text-rose-600'>
          Max {maxImages} images reached. Remove some to add more.
        </Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      disabled={isUploading}
      onPress={onPress}
      className='flex flex-col items-center justify-center gap-2'
    >
      {SvgIcon.galleryImport({ size: ICON_SIZE.LARGE, color: 'GRAY' })}
      <Text className='text-xs font-medium text-muted-foreground'>
        {isUploading
          ? 'Uploading...'
          : currentCount > 0
            ? `${currentCount} / ${maxImages} images selected. Tap to add more.`
            : placeholder}
      </Text>
    </TouchableOpacity>
  )
}

// UI Component for displaying selected images
interface ImageGridProps {
  images: string[]
  onRemoveImage: (index: number) => void
}

export function ImageGrid({ images, onRemoveImage }: ImageGridProps) {
  if (images.length === 0) return null

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className='flex flex-row gap-2'>
        {images.map((imageUri, index) => (
          <ImageThumbnail key={`${imageUri}-${index}`} uri={imageUri} onRemove={() => onRemoveImage(index)} />
        ))}
      </View>
    </ScrollView>
  )
}

interface ImageThumbnailProps {
  uri: string
  onRemove: () => void
  className?: string
}

export function ImageThumbnail({ uri, onRemove, className }: ImageThumbnailProps) {
  return (
    <View className='relative'>
      <View className={cn('w-24 h-24 border border-border rounded-xl', className)}>
        <Image style={{ width: '100%', height: '100%', borderRadius: 12 }} source={{ uri }} resizeMode='cover' />
      </View>
      <Pressable
        onPress={onRemove}
        className='absolute top-1 right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-lg border border-white'
      >
        <Icon as={X} size={12} color='white' />
      </Pressable>
    </View>
  )
}

// UI Component for reset button
interface ImageResetButtonProps {
  onReset: () => void
}

export function ImageResetButton({ onReset }: ImageResetButtonProps) {
  return (
    <TouchableOpacity
      onPress={onReset}
      className='flex flex-row items-center justify-center gap-2 p-3 bg-rose-100 rounded-xl'
    >
      <Icon as={RefreshCcw} size={16} color='#f43f5e' />
      <Text className='text-sm font-medium text-rose-600'>Clear all images</Text>
    </TouchableOpacity>
  )
}

// Main ImagePickerComponent using the hook (backward compatibility)
interface ImagePickerComponentProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  maxSizeInMB?: number
  placeholder?: string
  containerClassName?: string
  path: string
}

export function ImagePickerComponent({
  images,
  onImagesChange,
  maxImages = 5,
  maxSizeInMB = 5,
  placeholder = 'Add images',
  containerClassName = '',
  path
}: ImagePickerComponentProps) {
  const { pickImages, removeImage, resetImages, isUploading, isMaxReached } = useImagePicker({
    maxImages,
    maxSizeInMB,
    initialImages: images,
    path
  })

  const handlePickImages = async () => {
    const newUrls = await pickImages()
    if (newUrls.length > 0) {
      onImagesChange([...images, ...newUrls])
    }
  }

  const handleRemoveImage = (index: number) => {
    removeImage(index)
    const updatedImages = images.filter((_, i) => i !== index)
    onImagesChange(updatedImages)
  }

  const handleResetImages = () => {
    resetImages()
    onImagesChange([])
  }

  return (
    <View className='flex flex-col gap-4'>
      <View
        className={`flex flex-col gap-4 p-2 border border-dashed rounded-2xl ${containerClassName} ${
          isMaxReached ? 'border-rose-200 bg-rose-50/50' : 'border-input bg-muted/20'
        }`}
      >
        <ImagePickerTrigger
          onPress={handlePickImages}
          isUploading={isUploading}
          isMaxReached={isMaxReached}
          currentCount={images.length}
          maxImages={maxImages}
          placeholder={placeholder}
        />

        <ImageGrid images={images} onRemoveImage={handleRemoveImage} />

        {isMaxReached && <ImageResetButton onReset={handleResetImages} />}
      </View>
    </View>
  )
}
