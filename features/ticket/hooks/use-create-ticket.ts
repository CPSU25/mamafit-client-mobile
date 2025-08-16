import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import ticketService from '~/services/ticket.service'
import { TicketType } from '~/types/ticket.type'
import { createTicketFormSchema, CreateTicketFormSchema } from '../validations'

const defaultValues: CreateTicketFormSchema = {
  orderItemId: '',
  title: '',
  images: [],
  videos: [],
  description: '',
  type: TicketType.WarrantyService
}

export const useCreateTicket = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const methods = useForm<CreateTicketFormSchema>({
    defaultValues,
    resolver: zodResolver(createTicketFormSchema)
  })

  const createTicketMutation = useMutation({
    mutationFn: ticketService.createTicket,
    onSuccess: (ticketId) => {
      if (ticketId) {
        queryClient.invalidateQueries({ queryKey: ['tickets'] })
        queryClient.invalidateQueries({ queryKey: ['ticket'] })
        router.replace({ pathname: '/ticket/[ticketId]/detail', params: { ticketId } })
        setTimeout(() => {
          methods.reset()
        }, 500)
      }
    },
    onError: (error) => {
      toast.error(error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG)
    }
  })

  return { methods, createTicketMutation }
}
