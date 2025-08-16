import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import ticketService from '~/services/ticket.service'

export const useGetTicket = (ticketId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['ticket', ticketId, user?.userId],
    queryFn: () => ticketService.getTicket(ticketId),
    enabled: isAuthenticated && Boolean(ticketId)
  })
}
