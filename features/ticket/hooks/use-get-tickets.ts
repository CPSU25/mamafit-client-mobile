import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import ticketService from '~/services/ticket.service'

export const useGetTickets = () => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['tickets', user?.userId],
    queryFn: ticketService.getTickets,
    enabled: isAuthenticated
  })
}
