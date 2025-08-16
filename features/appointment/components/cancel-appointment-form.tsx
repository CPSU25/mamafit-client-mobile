import { Feather } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '~/components/ui/input'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { isFormError } from '~/lib/utils'
import { CancelAppointmentFormSchema } from '../validations'

export default function CancelAppointmentForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<CancelAppointmentFormSchema>()

  return (
    <Controller
      control={control}
      name='reason'
      render={({ field: { onChange, value, ...field } }) => (
        <Input
          {...field}
          value={value}
          onChangeText={onChange}
          placeholder='Lý Do'
          StartIcon={<Feather name='alert-triangle' size={20} color={PRIMARY_COLOR.LIGHT} />}
          autoFocus
          spellCheck={false}
          className={isFormError(errors, 'reason') ? 'border-rose-500' : ''}
        />
      )}
    />
  )
}
