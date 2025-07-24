import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { bookAppointmentFormSchema, BookAppointmentFormSchema } from '../validations'

const defaultValues: BookAppointmentFormSchema = {
  userId: '',
  branchId: '',
  fullName: '',
  phoneNumber: '',
  bookingTime: new Date(),
  note: '',
  status: 'UP_COMMING'
}

export const useBookAppointment = () => {
  const methods = useForm<BookAppointmentFormSchema>({
    defaultValues,
    resolver: zodResolver(bookAppointmentFormSchema)
  })

  return { methods }
}
