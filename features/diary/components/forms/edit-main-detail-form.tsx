import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { View } from 'react-native'
import FieldError from '~/components/field-error'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useFieldError } from '~/hooks/use-field-error'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, isFormError } from '~/lib/utils'
import { MeasurementsFormInput, MeasurementsFormOutput } from '../../validations'

interface EditMainDetailFormProps {
  methods: UseFormReturn<MeasurementsFormInput, unknown, MeasurementsFormOutput>
}

export default function EditMainDetailForm({ methods }: EditMainDetailFormProps) {
  const {
    control,
    formState: { errors }
  } = methods
  const className = useFieldError()

  return (
    <View className='flex flex-col gap-2 mt-2'>
      {/* Weight */}
      <Controller
        control={control}
        name='weight'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            placeholder='Weight'
            keyboardType='numeric'
            StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
            {...field}
            value={value}
            onChangeText={onChange}
            className={cn('bg-background border-input', isFormError(errors, 'weight') ? className : '')}
            EndIcon={<Text className='text-muted-foreground text-sm'>kg</Text>}
          />
        )}
      />
      {isFormError(errors, 'weight') && <FieldError message={errors.weight?.message || ''} />}

      {/* Bust */}
      <Controller
        control={control}
        name='bust'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            placeholder='Bust circumference'
            keyboardType='numeric'
            StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
            {...field}
            value={value}
            onChangeText={onChange}
            className={cn('bg-background border-input', isFormError(errors, 'bust') ? className : '')}
            EndIcon={<Text className='text-muted-foreground text-sm'>cm</Text>}
          />
        )}
      />
      {isFormError(errors, 'bust') && <FieldError message={errors.bust?.message || ''} />}

      {/* Waist */}
      <Controller
        control={control}
        name='waist'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            placeholder='Waist circumference'
            keyboardType='numeric'
            StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
            {...field}
            value={value}
            onChangeText={onChange}
            className={cn('bg-background border-input', isFormError(errors, 'waist') ? className : '')}
            EndIcon={<Text className='text-muted-foreground text-sm'>cm</Text>}
          />
        )}
      />
      {isFormError(errors, 'waist') && <FieldError message={errors.waist?.message || ''} />}

      {/* Hip */}
      <Controller
        control={control}
        name='hip'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            placeholder='Hip circumference'
            keyboardType='numeric'
            StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
            {...field}
            value={value}
            onChangeText={onChange}
            className={cn('bg-background border-input', isFormError(errors, 'hip') ? className : '')}
            EndIcon={<Text className='text-muted-foreground text-sm'>cm</Text>}
          />
        )}
      />
      {isFormError(errors, 'hip') && <FieldError message={errors.hip?.message || ''} />}
    </View>
  )
}
