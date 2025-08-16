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
  const { pickImages, isUploading, isMaxReached } = useImagePicker({ maxImages: 1, path: 'add-ons' })

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

    const urls = await pickImages()
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
          <Text className='font-inter-medium text-emerald-600'>Giá Cuối Cùng</Text>
          {validPair ? (
            <Text className='font-inter-medium text-emerald-600'>
              <Text className='underline font-inter-medium text-emerald-600'>đ</Text>
              {validPair?.price.toLocaleString('vi-VN')}
            </Text>
          ) : (
            <Text className='text-emerald-600 text-sm'>Đang chờ lựa chọn của bạn</Text>
          )}
        </View>

        <Controller
          control={control}
          name='positionId'
          render={({ field }) => (
            <View className='flex-col gap-4'>
              <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
                <Text className='font-inter-semibold'>Vị Trí</Text>
                <Text className='text-muted-foreground text-xs'>
                  Vui lòng chọn vị trí để đặt add-on lên áo, như là vòng ngực, vòng eo, hoặc vòng tay.
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
                <Text className='font-inter-semibold'>Kích Thước</Text>
                <Text className='text-muted-foreground text-xs'>
                  Vui lòng chọn kích thước bạn muốn cho add-on, như là nhỏ, trung bình, hoặc lớn.
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

        {types.length > 1 ? (
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <View className='flex-col gap-4'>
                <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
                  <Text className='font-inter-semibold'>Loại</Text>
                  <Text className='text-muted-foreground text-xs'>Chọn loại nội dung bạn muốn cho add-on</Text>
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
                      {type === 'TEXT' ? (
                        <MaterialCommunityIcons
                          name='text'
                          size={20}
                          color={field.value === type ? PRIMARY_COLOR.LIGHT : 'black'}
                        />
                      ) : null}
                      {type === 'IMAGE' ? (
                        <MaterialCommunityIcons
                          name='image'
                          size={20}
                          color={field.value === type ? PRIMARY_COLOR.LIGHT : 'black'}
                        />
                      ) : null}
                      <Text className={cn('text-sm font-inter-medium', field.value === type && 'text-primary')}>
                        {capitalizeText(type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              </View>
            )}
          />
        ) : null}

        {type && type !== 'PATTERN' ? (
          <Controller
            control={control}
            name='value'
            render={({ field: { onChange, value, ...field } }) => (
              <View className='gap-4'>
                <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
                  <Text className='font-inter-semibold'>Nội Dung</Text>
                  <Text className='text-muted-foreground text-xs'>Nhập nội dung hoặc tải lên ảnh để bắt đầu.</Text>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200)}>
                  {type === 'TEXT' ? (
                    <Input
                      {...field}
                      value={value}
                      onChangeText={onChange}
                      placeholder='Enter your content'
                      spellCheck={false}
                      className={cn(isFormError(errors, 'value') ? 'border-rose-500' : '')}
                    />
                  ) : null}
                  {type === 'IMAGE' ? (
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
                  ) : null}
                </Animated.View>
              </View>
            )}
          />
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  )
}
