import { Feather } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '~/components/ui/input'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { isFormError } from '~/lib/utils'
import { CancelOrderFormSchema } from '../../validations'

export default function CancelOrderForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<CancelOrderFormSchema>()

  return (
    <Controller
      control={control}
      name='canceledReason'
      render={({ field: { onChange, value, ...field } }) => (
        <Input
          {...field}
          value={value}
          onChangeText={onChange}
          placeholder='Reason'
          StartIcon={<Feather name='alert-triangle' size={20} color={PRIMARY_COLOR.LIGHT} />}
          autoFocus
          spellCheck={false}
          className={isFormError(errors, 'canceledReason') ? 'border-rose-500' : ''}
        />
      )}
    />
  )
}
