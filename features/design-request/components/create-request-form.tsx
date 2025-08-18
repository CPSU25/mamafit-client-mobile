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
      <Animated.View entering={FadeInDown.delay(100)}>
        <Text className='font-inter-medium text-sm'>Yêu cầu thiết kế</Text>
        <Text className='text-muted-foreground text-xs'>
          Hoàn thành biểu mẫu bên dưới để gửi yêu cầu thiết kế của bạn.
        </Text>
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
            placeholder='Chọn ảnh'
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
              placeholder='Mô tả yêu cầu thiết kế của bạn'
              value={value}
              onChangeText={onChange}
              aria-labelledby='textareaLabel'
              className={cn(
                'native:text-base bg-background border-input',
                isFormError(errors, 'description') ? className : ''
              )}
            />
          )}
        />
        {isFormError(errors, 'description') && <FieldError message={errors.description?.message || ''} />}
      </Animated.View>

      <WarningCard title='Lưu ý' delay={400}>
        <Text className='text-xs text-amber-600 dark:text-amber-500'>
          Bạn sẽ được tính phí
          <Text className='text-xs font-inter-semibold text-amber-600 dark:text-amber-500'>
            {' '}
            {config && config.designRequestServiceFee && config.designRequestServiceFee.toLocaleString('vi-VN')} VND
          </Text>{' '}
          phí dịch vụ cho mỗi yêu cầu thiết kế.
        </Text>
      </WarningCard>

      <TipCard title='Mẹo' delay={500}>
        <View className='flex flex-col gap-1'>
          <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
            • Vui lòng cung cấp mô tả rõ ràng và chi tiết về yêu cầu thiết kế của bạn.
          </Text>
          <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
            • Ảnh là tùy chọn, nhưng chúng có thể giúp chúng tôi hiểu yêu cầu của bạn tốt hơn.
          </Text>
        </View>
      </TipCard>
    </View>
  )
}
