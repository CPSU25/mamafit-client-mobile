import { Feather } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import DatePicker from '~/components/date-picker'
import FieldError from '~/components/field-error'
import { Input } from '~/components/ui/input'
import { useFieldError } from '~/hooks/use-field-error'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { isFormError } from '~/lib/utils'
import { PersonalInfoFormSchema } from './validations'

export default function PersonalInfoForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<PersonalInfoFormSchema>()
  const className = useFieldError()

  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  const minDate = new Date(today.getFullYear() - 55, today.getMonth(), today.getDate())

  return (
    <View className='flex flex-col gap-4 mt-4'>
      <Controller
        control={control}
        name='name'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            placeholder='Diary name'
            keyboardType='default'
            StartIcon={<Feather name='book' size={20} color={PRIMARY_COLOR.LIGHT} />}
            {...field}
            value={value}
            onChangeText={onChange}
            className={isFormError(errors, 'name') ? className : ''}
          />
        )}
      />
      {isFormError(errors, 'name') && <FieldError message={errors.name?.message || ''} />}
      <Controller
        control={control}
        name='weight'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            placeholder='Weight (kg)'
            keyboardType='numeric'
            StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
            {...field}
            value={value}
            onChangeText={onChange}
            className={isFormError(errors, 'weight') ? className : ''}
          />
        )}
      />
      {isFormError(errors, 'weight') && <FieldError message={errors.weight?.message || ''} />}
      <Controller
        control={control}
        name='height'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            placeholder='Height (cm)'
            keyboardType='numeric'
            StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
            {...field}
            value={value}
            onChangeText={onChange}
            className={isFormError(errors, 'height') ? className : ''}
          />
        )}
      />
      {isFormError(errors, 'height') && <FieldError message={errors.height?.message || ''} />}
      <DatePicker
        control={control}
        name='dateOfBirth'
        placeholder='Date of birth'
        required
        errors={errors}
        minDate={minDate}
        maxDate={maxDate}
      />
      {isFormError(errors, 'dateOfBirth') && <FieldError message={errors.dateOfBirth?.message || ''} />}
    </View>
  )
}
