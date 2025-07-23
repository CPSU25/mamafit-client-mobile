import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import FieldError from '~/components/field-error'
import Loading from '~/components/loading'
import { TipCard, WarningCard } from '~/components/ui/alert-card'
import { ImageGrid, ImagePickerTrigger, ImageResetButton } from '~/components/ui/image-picker'
import { Text } from '~/components/ui/text'
import { Textarea } from '~/components/ui/textarea'
import { PlaceDesignRequestOrderFormSchema } from '~/features/order/validations'
import { useFieldError } from '~/hooks/use-field-error'
import { useGetConfig } from '~/hooks/use-get-config'
import { cn, isFormError } from '~/lib/utils'

interface CreateDesignRequestFormProps {
  pickImages: () => Promise<string[]>
  resetImages: () => void
  isUploading: boolean
  isMaxReached: boolean
  currentImages: string[]
}

export default function CreateDesignRequestForm({
  pickImages,
  resetImages,
  isUploading,
  isMaxReached,
  currentImages
}: CreateDesignRequestFormProps) {
  const { data: config, isLoading: isLoadingConfig } = useGetConfig()
  const {
    control,
    formState: { errors },
    setValue
  } = useFormContext<PlaceDesignRequestOrderFormSchema>()
  const className = useFieldError()

  const handlePickImages = async () => {
    const newUrls = await pickImages()
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

  if (isLoadingConfig) {
    return <Loading />
  }

  return (
    <View className='flex flex-col gap-4'>
      <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
        <Text className='font-inter-semibold'>Design Request</Text>
        <Text className='text-muted-foreground text-xs'>Complete the form below to submit your design request.</Text>
      </Animated.View>

      {/* Custom Image Picker UI */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <View
          className={`flex flex-col gap-4 p-2 border border-dashed rounded-2xl ${
            isMaxReached ? 'border-rose-200 bg-rose-50/50' : 'border-input bg-muted/20'
          }`}
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
      </Animated.View>

      {/* Description */}
      <Animated.View entering={FadeInDown.delay(300)} className='flex flex-col gap-2'>
        <Controller
          control={control}
          name='description'
          render={({ field: { onChange, value } }) => (
            <Textarea
              placeholder='Describe your design request'
              value={value}
              onChangeText={onChange}
              aria-labelledby='textareaLabel'
              className={cn('bg-background border-input', isFormError(errors, 'description') ? className : '')}
            />
          )}
        />
        {isFormError(errors, 'description') && <FieldError message={errors.description?.message || ''} />}
      </Animated.View>

      <WarningCard title='Notes' delay={400}>
        <Text className='text-xs text-amber-600 dark:text-amber-500'>
          You will be charged
          <Text className='text-xs font-inter-semibold text-amber-600 dark:text-amber-500'>
            {' '}
            {config && config.designRequestServiceFee && config.designRequestServiceFee.toLocaleString('vi-VN')} VND
          </Text>{' '}
          service fee for each design request.
        </Text>
      </WarningCard>

      <TipCard title='Tips' delay={500}>
        <View className='flex flex-col gap-1'>
          <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
            • Please provide a clear and detailed description of your design request.
          </Text>
          <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
            • Images are optional, but they can help us understand your request better.
          </Text>
        </View>
      </TipCard>
    </View>
  )
}
