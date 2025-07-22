import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { InfoCard } from '~/components/ui/alert-card'
import { Input } from '~/components/ui/input'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, isFormError } from '~/lib/utils'
import { OptionMap } from '../../types'
import { capitalizeText, isPositionEnabled, isSizeEnabled } from '../../utils'
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

  const types: any[] = []
  const sizeId = watch('sizeId')
  const positionId = watch('positionId')
  const type = watch('type')

  const screenWidth = Dimensions.get('window').width
  const cardWidth = (screenWidth - 44) / 3

  return (
    <ScrollView className='flex-1'>
      <InfoCard
        title='Price May Vary'
        description='Your selections, such as position and size, will affect the final price of your order.'
        className='mx-4 my-4'
      />

      <View className='flex-1 px-4 gap-4'>
        <Controller
          control={control}
          name='positionId'
          render={({ field }) => (
            <View className='flex-col gap-4'>
              <View className='flex flex-col gap-1'>
                <Text className='font-inter-semibold'>Positions</Text>
                <Text className='text-muted-foreground text-xs'>
                  Please choose where to place the add-on on the dress, like chest, waist, or sleeve.
                </Text>
              </View>

              <View className='flex-row items-center gap-2 flex-wrap'>
                {optionDetail.positions.map((pos) => (
                  <TouchableOpacity
                    key={pos.positionId}
                    onPress={() => {
                      field.onChange(pos.positionId)
                      setValue('sizeId', '')
                      setValue('type', '')
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
              </View>
            </View>
          )}
        />
        <Controller
          control={control}
          name='sizeId'
          render={({ field }) => (
            <View className='flex-col gap-4'>
              <View className='flex flex-col gap-1'>
                <Text className='font-inter-semibold'>Available Sizes</Text>
                <Text className='text-muted-foreground text-xs'>
                  Please choose the size you want for the add-on, such as small, medium, or large.
                </Text>
              </View>
              <View className='flex-row items-center flex-wrap gap-2'>
                {optionDetail.sizes.map((size) => (
                  <TouchableOpacity
                    key={size.sizeId}
                    onPress={() => {
                      field.onChange(size.sizeId)
                      setValue('type', '')
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
              </View>
            </View>
          )}
        />

        {types.length > 0 && (
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <View className='flex-col gap-4'>
                <View className='flex flex-col gap-1'>
                  <Text className='font-inter-semibold'>Types</Text>
                  <Text className='text-muted-foreground text-xs'>
                    Choose the type of content you want for the add-on
                  </Text>
                </View>
                <View className='flex-row items-center flex-wrap gap-2'>
                  {types.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => field.onChange(type)}
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
                </View>
              </View>
            )}
          />
        )}

        {type && (
          <Controller
            control={control}
            name='value'
            render={({ field: { onChange, value, ...field } }) => (
              <View className='gap-4'>
                <View className='flex flex-col gap-1'>
                  <Text className='font-inter-semibold'>Your Content</Text>
                  <Text className='text-muted-foreground text-xs'>
                    Enter your content or upload an image to get started.
                  </Text>
                </View>
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
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  )
}
