import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import appointmentService from '~/services/appointment.service'
import { bookAppointmentFormSchema, BookAppointmentFormSchema } from '../validations'

const defaultValues: BookAppointmentFormSchema = {
  branchId: '',
  bookingTime: '',
  bookingDate: format(new Date(), 'yyyy-MM-dd'),
  bookingSlot: '',
  note: ''
}

export const useBookAppointment = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const methods = useForm<BookAppointmentFormSchema>({
    defaultValues,
    resolver: zodResolver(bookAppointmentFormSchema)
  })

  const bookAppointmentMutation = useMutation({
    mutationFn: appointmentService.bookAppointment,
    onSuccess: (appointmentId) => {
      queryClient.invalidateQueries({ queryKey: ['available-slots'] })
      setTimeout(() => {
        methods.reset()
      }, 500)
      router.push(`/profile/appointment/${appointmentId}`)
    },
    onError: (error) => {
      toast.error(error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG)
    }
  })

  return { methods, bookAppointmentMutation }
}
