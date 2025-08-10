import { Controller, useFormContext } from 'react-hook-form'
import { Image, View } from 'react-native'
import FieldError from '~/components/field-error'
import { Card } from '~/components/ui/card'
import { ImagePickerComponent } from '~/components/ui/image-picker'
import { Text } from '~/components/ui/text'
import { Textarea } from '~/components/ui/textarea'
import { useFieldError } from '~/hooks/use-field-error'
import { styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { OrderItem } from '~/types/order.type'
import { CreateWarrantyRequestSchema } from '../validations'

interface CreateWarrantyRequestFormProps {
  index: number
  orderItem?: OrderItem
}

export default function CreateWarrantyRequestForm({ index, orderItem }: CreateWarrantyRequestFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
    watch
  } = useFormContext<CreateWarrantyRequestSchema>()
  const className = useFieldError()
  const imagesPath = `items.${index}.images` as const
  const descriptionPath = `items.${index}.description` as const

  const currentImages = (watch(imagesPath) as string[]) || []
  const itemErrors = (errors.items?.[index] as any) || {}

  return (
    <Card className='p-2 gap-2' style={styles.container}>
      <View className='flex-1 flex-row items-start gap-2'>
        <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
          <Image source={{ uri: orderItem?.preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
        </View>
        <View className='flex-1 h-20 justify-between pr-2'>
          <View>
            <Text className='native:text-sm font-inter-medium'>{orderItem?.preset?.styleName || 'Custom'} Dress</Text>
            <View className='flex-row items-center justify-between'>
              <Text className='native:text-xs text-muted-foreground'>
                {orderItem?.preset?.styleName ? 'Made-to-Order Custom Style' : 'Tailored Just for You'}
              </Text>
              <Text className='native:text-xs text-muted-foreground'>x{orderItem?.quantity || 1}</Text>
            </View>
          </View>
          <View className='items-end'>
            <Text className='native:text-xs'>SKU: {orderItem?.preset?.sku ?? 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View className='gap-1'>
        <ImagePickerComponent
          images={currentImages}
          onImagesChange={(imgs) => setValue(imagesPath, imgs, { shouldDirty: true, shouldValidate: true })}
          maxImages={5}
          placeholder='Add images for this item'
          containerClassName='rounded-xl'
        />
        {!!itemErrors?.images?.message && <FieldError message={String(itemErrors.images.message)} />}
      </View>

      <View className='gap-1'>
        <Controller
          control={control}
          name={descriptionPath}
          render={({ field: { value, onChange, onBlur } }) => (
            <Textarea
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder='Describe the defect and where it appears'
              className={cn('rounded-xl native:text-base', itemErrors?.description && className)}
            />
          )}
        />
        {!!itemErrors?.description?.message && <FieldError message={String(itemErrors.description.message)} />}
      </View>
    </Card>
  )
}
