import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import appointmentService from '~/services/appointment.service'
import { bookAppointmentFormSchema, BookAppointmentFormSchema } from '../validations'
import { BranchWithDirection } from '~/types/order.type'

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
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState<BranchWithDirection | null>(null)

  const methods = useForm<BookAppointmentFormSchema>({
    defaultValues,
    resolver: zodResolver(bookAppointmentFormSchema)
  })

  const bookAppointmentMutation = useMutation({
    mutationFn: appointmentService.bookAppointment,
    onSuccess: (appointmentId) => {
      queryClient.invalidateQueries({ queryKey: ['available-slots'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      setTimeout(() => {
        methods.reset()
        setCurrentStep(1)
        setSelectedBranch(null)
      }, 500)
      router.push(`/profile/appointment/${appointmentId}`)
    },
    onError: (error) => {
      toast.error(error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG)
    }
  })

  return { methods, bookAppointmentMutation, currentStep, setCurrentStep, selectedBranch, setSelectedBranch }
}
