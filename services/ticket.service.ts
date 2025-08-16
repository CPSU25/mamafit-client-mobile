import { CreateTicketFormSchema } from '~/features/ticket/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'
import { Ticket } from '~/types/ticket.type'

class TicketService {
  async getTickets() {
    const { data } = await api.get<BaseResponse<Ticket[]>>('ticket/current-user')

    return data.data?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getTicket(ticketId: string) {
    const { data } = await api.get<BaseResponse<Ticket>>(`ticket/${ticketId}`)

    return data.data
  }

  async createTicket(input: CreateTicketFormSchema) {
    const { data } = await api.post<BaseResponse<string>>('ticket', input)

    return data.data
  }
}

const ticketService = new TicketService()
export default ticketService
