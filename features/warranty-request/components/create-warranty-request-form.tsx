import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import FieldError from '~/components/field-error'
import { ImageGrid, ImagePickerTrigger, ImageResetButton } from '~/components/ui/image-picker'
import { Textarea } from '~/components/ui/textarea'
import { useFieldError } from '~/hooks/use-field-error'
import { cn, isFormError } from '~/lib/utils'
import { CreateWarrantyRequestSchema } from '../validations'

interface CreateDesignRequestFormProps {
  pickImages: (path?: string) => Promise<string[]>
  resetImages: () => void
  isUploading: boolean
  isMaxReached: boolean
  currentImages: string[]
}

export default function CreateWarrantyRequestForm({
  pickImages,
  resetImages,
  isUploading,
  isMaxReached,
  currentImages
}: CreateDesignRequestFormProps) {
  const {
    control,
    formState: { errors },
    setValue
  } = useFormContext<CreateWarrantyRequestSchema>()
  const className = useFieldError()

  const handlePickImages = async () => {
    const newUrls = await pickImages('warranty-requests')
    if (newUrls.length > 0) {
      setValue('images', [...currentImages, ...newUrls])
    }
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = currentImages.filter((_, i) => i !== index)
    setValue('images', updatedImages)
  }

  const handleResetImages = () => {
    resetImages()
    setValue('images', [])
  }

  return (
    <View className='gap-4'>
      <Animated.View entering={FadeInDown.delay(200)} className='gap-2'>
        <View
          className={cn(
            'flex flex-col gap-4 p-2 border border-dashed rounded-2xl',
            isMaxReached || isFormError(errors, 'images') ? 'border-rose-200 bg-rose-50/50' : 'border-input bg-muted/20'
          )}
        >
          <ImagePickerTrigger
            onPress={handlePickImages}
            isUploading={isUploading}
            isMaxReached={isMaxReached}
            currentCount={currentImages.length}
            maxImages={5}
            placeholder='Choose images from your gallery'
          />

          <ImageGrid images={currentImages} onRemoveImage={handleRemoveImage} />

          {isMaxReached && <ImageResetButton onReset={handleResetImages} />}
        </View>
        {isFormError(errors, 'images') && <FieldError message={errors.images?.message || ''} />}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} className='flex flex-col gap-2'>
        <Controller
          control={control}
          name='description'
          render={({ field: { onChange, value } }) => (
            <Textarea
              placeholder='Describe the issue with your item'
              value={value}
              onChangeText={onChange}
              aria-labelledby='textareaLabel'
              className={cn('bg-background border-input', isFormError(errors, 'description') ? className : '')}
            />
          )}
        />
        {isFormError(errors, 'description') && <FieldError message={errors.description?.message || ''} />}
      </Animated.View>
    </View>
  )
}
