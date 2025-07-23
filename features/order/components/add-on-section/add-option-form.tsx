import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Dimensions, Image, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { ImageGrid } from '~/components/ui/image-picker'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useImagePicker } from '~/hooks/use-image-picker'
import { ICON_SIZE, KEYBOARD_OFFSET, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn, isFormError } from '~/lib/utils'
import { OptionMap } from '../../types'
import { capitalizeText, getAvailableTypes, getValidPair, isPositionEnabled, isSizeEnabled } from '../../utils'
import { SelectAddOnOptionFormSchema } from '../../validations'

interface AddOptionFormProps {
  optionDetail: OptionMap
}

export default function AddOptionForm({ optionDetail }: AddOptionFormProps) {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<SelectAddOnOptionFormSchema>()
  const { pickImages, isUploading, isMaxReached } = useImagePicker({ maxImages: 1 })

  const sizeId = watch('sizeId')
  const positionId = watch('positionId')
  const type = watch('type')
  const types = getAvailableTypes(optionDetail, positionId, sizeId)

  const validPair = getValidPair(optionDetail, positionId, sizeId, type)

  const screenWidth = Dimensions.get('window').width
  const cardWidth = (screenWidth - 44) / 3

  useEffect(() => {
    if (types.length === 1 && types[0] !== type) {
      setValue('type', types[0], { shouldValidate: true })
    }
  }, [types, type, setValue])

  const handleUploadImage = async () => {
    if (type !== 'IMAGE') return

    const urls = await pickImages('add-ons')
    if (urls.length > 0) {
      setValue('value', urls[0])
    }
  }

  const handleRemoveImage = () => {
    setValue('value', '')
  }

  return (
    <KeyboardAwareScrollView bottomOffset={KEYBOARD_OFFSET} className='flex-1' showsVerticalScrollIndicator={false}>
      <View className='flex-1 p-4 gap-4'>
        <View className='flex-row items-center justify-between bg-emerald-100 p-4 rounded-2xl border border-emerald-500 border-dashed'>
          <Text className='font-inter-medium text-emerald-600'>Final Price</Text>
          {validPair ? (
            <Text className='font-inter-medium text-emerald-600'>
              <Text className='underline font-inter-medium text-emerald-600'>đ</Text>
              {validPair?.price.toLocaleString('vi-VN')}
            </Text>
          ) : (
            <Text className='text-emerald-600 text-sm'>Waiting for your selection</Text>
          )}
        </View>

        <Controller
          control={control}
          name='positionId'
          render={({ field }) => (
            <View className='flex-col gap-4'>
              <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
                <Text className='font-inter-semibold'>Positions</Text>
                <Text className='text-muted-foreground text-xs'>
                  Please choose where to place the add-on on the dress, like chest, waist, or sleeve.
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200)} className='flex-row items-center gap-2 flex-wrap'>
                {optionDetail.positions.map((pos) => (
                  <TouchableOpacity
                    key={pos.positionId}
                    onPress={() => {
                      field.onChange(pos.positionId)
                      setValue('positionName', pos.positionName)
                      setValue('sizeId', '')
                      setValue('sizeName', '')
                      setValue('type', '')
                      setValue('value', '')
                    }}
                    disabled={!isPositionEnabled(optionDetail, pos.positionId, sizeId)}
                    style={{ width: cardWidth }}
                    className={cn(
                      'p-1 rounded-2xl bg-muted/20 gap-2 items-center border border-border',
                      field.value === pos.positionId && 'bg-primary/10 border-primary opacity-100',
                      !isPositionEnabled(optionDetail, pos.positionId, sizeId) && 'opacity-30'
                    )}
                  >
                    <Image
                      source={{
                        uri:
                          pos.image ||
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD4qmuiXoOrmp-skck7b7JjHA8Ry4TZyPHkw&s'
                      }}
                      className='w-full h-16 rounded-xl'
                    />

                    <Text
                      className={cn(
                        'font-inter-medium text-center text-xs text-muted-foreground',
                        field.value === pos.positionId && 'text-primary'
                      )}
                      numberOfLines={1}
                    >
                      {pos.positionName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>
          )}
        />
        <Controller
          control={control}
          name='sizeId'
          render={({ field }) => (
            <View className='flex-col gap-4'>
              <Animated.View entering={FadeInDown.delay(300)} className='flex flex-col gap-1'>
                <Text className='font-inter-semibold'>Available Sizes</Text>
                <Text className='text-muted-foreground text-xs'>
                  Please choose the size you want for the add-on, such as small, medium, or large.
                </Text>
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(400)} className='flex-row items-center flex-wrap gap-2'>
                {optionDetail.sizes.map((size) => (
                  <TouchableOpacity
                    key={size.sizeId}
                    onPress={() => {
                      field.onChange(size.sizeId)
                      setValue('sizeName', size.sizeName)
                      setValue('type', '')
                      setValue('value', '')
                    }}
                    disabled={!isSizeEnabled(optionDetail, size.sizeId, positionId)}
                    className={cn(
                      'px-4 py-2 rounded-xl border border-border',
                      field.value === size.sizeId && 'bg-primary/10 border-primary',
                      !isSizeEnabled(optionDetail, size.sizeId, positionId) && 'opacity-30'
                    )}
                  >
                    <Text className={cn('text-sm font-inter-medium', field.value === size.sizeId && 'text-primary')}>
                      {size.sizeName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>
          )}
        />

        {types.length > 1 && (
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <View className='flex-col gap-4'>
                <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
                  <Text className='font-inter-semibold'>Types</Text>
                  <Text className='text-muted-foreground text-xs'>
                    Choose the type of content you want for the add-on
                  </Text>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200)} className='flex-row items-center flex-wrap gap-2'>
                  {types.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => {
                        field.onChange(type)
                        setValue('value', '')
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl flex-row items-center gap-2 border border-border',
                        field.value === type && 'bg-primary/10 border-primary'
                      )}
                    >
                      {type === 'TEXT' && (
                        <MaterialCommunityIcons
                          name='text'
                          size={20}
                          color={field.value === type ? PRIMARY_COLOR.LIGHT : 'black'}
                        />
                      )}
                      {type === 'IMAGE' && (
                        <MaterialCommunityIcons
                          name='image'
                          size={20}
                          color={field.value === type ? PRIMARY_COLOR.LIGHT : 'black'}
                        />
                      )}
                      <Text className={cn('text-sm font-inter-medium', field.value === type && 'text-primary')}>
                        {capitalizeText(type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              </View>
            )}
          />
        )}

        {type && type !== 'PATTERN' && (
          <Controller
            control={control}
            name='value'
            render={({ field: { onChange, value, ...field } }) => (
              <View className='gap-4'>
                <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
                  <Text className='font-inter-semibold'>Your Content</Text>
                  <Text className='text-muted-foreground text-xs'>
                    Enter your content or upload an image to get started.
                  </Text>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200)}>
                  {type === 'TEXT' && (
                    <Input
                      {...field}
                      value={value}
                      onChangeText={onChange}
                      placeholder='Enter your content'
                      spellCheck={false}
                      className={cn(isFormError(errors, 'value') ? 'border-rose-500' : '')}
                    />
                  )}
                  {type === 'IMAGE' && (
                    <TouchableOpacity onPress={handleUploadImage} disabled={isUploading}>
                      <View className='flex-1 flex-col gap-2 p-1 border border-dashed border-input bg-muted/20 rounded-2xl'>
                        <View className='justify-center items-center gap-2 pt-2'>
                          {SvgIcon.galleryImport({ size: ICON_SIZE.LARGE, color: 'GRAY' })}
                          <Text className='text-xs font-medium text-muted-foreground'>
                            {isUploading
                              ? 'Uploading...'
                              : isMaxReached
                                ? '*Note: You cannot change this after placing an order'
                                : 'Add image'}
                          </Text>
                        </View>
                        <ImageGrid images={value ? [value] : []} onRemoveImage={handleRemoveImage} />
                      </View>
                    </TouchableOpacity>
                  )}
                </Animated.View>
              </View>
            )}
          />
        )}
      </View>
    </KeyboardAwareScrollView>
  )
}
