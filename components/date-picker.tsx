import { Feather } from '@expo/vector-icons'
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { useFieldError } from '~/hooks/use-field-error'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { isFormError } from '~/lib/utils'
import { Input } from './ui/input'
import { Text } from './ui/text'

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  placeholder?: string
  label?: string
  errors: FieldErrors<T>
  required?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

export default function DatePicker<T extends FieldValues>({
  control,
  name,
  placeholder = 'Select date',
  label,
  errors,
  required = false,
  className = '',
  minDate,
  maxDate,
  disabled = false
}: DatePickerProps<T>) {
  const classname = useFieldError()

  const showDatepicker = (onChange: (date: string) => void, value: string | null) => {
    DateTimePickerAndroid.open({
      value: value ? new Date(value) : new Date(),
      minimumDate: minDate,
      maximumDate: maxDate,
      onChange: (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        if (selectedDate) {
          if (minDate && selectedDate < minDate) {
            selectedDate = minDate
          }
          if (maxDate && selectedDate > maxDate) {
            selectedDate = maxDate
          }
          onChange(format(selectedDate, 'yyyy-MM-dd'))
        }
      },
      mode: 'date',
      is24Hour: false
    })
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className={className}>
          {label ? (
            <Text className='mb-2'>
              {label}
              {required && <Text className={classname}> *</Text>}
            </Text>
          ) : null}
          <TouchableOpacity onPress={() => !disabled && showDatepicker(onChange, value)} disabled={disabled}>
            <Input
              value={value ? format(new Date(value), 'dd/MM/yyyy') : ''}
              placeholder={placeholder}
              StartIcon={<Feather name='calendar' size={20} color={PRIMARY_COLOR.LIGHT} />}
              {...(value &&
                !disabled && {
                  EndIcon: <Feather name='x-circle' size={20} color='gray' />,
                  onEndIconPress: () => onChange(null)
                })}
              readOnly
              className={isFormError(errors, name) ? classname : ''}
            />
          </TouchableOpacity>
        </View>
      )}
    />
  )
}
