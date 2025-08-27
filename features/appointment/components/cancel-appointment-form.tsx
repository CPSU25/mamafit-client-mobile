import { AlertTriangle } from 'lucide-react-native'
import { Controller, useFormContext } from 'react-hook-form'
import { Icon } from '~/components/ui/icon'
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
          placeholder='Lý do'
          StartIcon={<Icon as={AlertTriangle} size={20} color={PRIMARY_COLOR.LIGHT} />}
          autoFocus
          spellCheck={false}
          className={isFormError(errors, 'reason') ? 'border-rose-500' : ''}
        />
      )}
    />
  )
}
