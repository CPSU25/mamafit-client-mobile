import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import FieldError from '~/components/field-error'
import { TipCard, WarningCard } from '~/components/ui/alert-card'
import { ImagePickerComponent } from '~/components/ui/image-picker'
import { Text } from '~/components/ui/text'
import { Textarea } from '~/components/ui/textarea'
import { useFieldError } from '~/hooks/use-field-error'
import { cn, isFormError } from '~/lib/utils'
import { CreateRequestSchema } from '../validations'

export default function CreateDesignRequestForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<CreateRequestSchema>()
  const className = useFieldError()

  return (
    <View className='flex flex-col gap-4'>
      <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
        <Text className='font-inter-semibold'>Design Request</Text>
        <Text className='text-muted-foreground text-xs'>Complete the form below to submit your design request.</Text>
      </Animated.View>

      {/* Images */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <Controller
          control={control}
          name='images'
          render={({ field: { onChange, value } }) => (
            <ImagePickerComponent
              images={value}
              onImagesChange={onChange}
              maxImages={5}
              placeholder='Choose images from your gallery'
            />
          )}
        />
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
          <Text className='text-xs font-inter-semibold text-amber-600 dark:text-amber-500'> 100.000 VND</Text> service
          fee for each design request.
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
