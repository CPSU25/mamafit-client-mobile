import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
  const methods = useForm<CreateTicketFormSchema>({
    defaultValues,
    resolver: zodResolver(createTicketFormSchema)
  })

  return { methods }
}
