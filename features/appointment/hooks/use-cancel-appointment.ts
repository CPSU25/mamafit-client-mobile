import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import appointmentService from '~/services/appointment.service'
import { cancelAppointmentFormSchema, CancelAppointmentFormSchema } from '../validations'

const defaultValues: CancelAppointmentFormSchema = {
  reason: ''
}

export const useCancelAppointment = () => {
  const methods = useForm<CancelAppointmentFormSchema>({
    defaultValues,
    resolver: zodResolver(cancelAppointmentFormSchema)
  })

  const cancelAppointmentMutation = useMutation({
    mutationFn: appointmentService.cancelAppointment
  })

  return { methods, cancelAppointmentMutation }
}
