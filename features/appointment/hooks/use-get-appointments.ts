import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import appointmentService from '~/services/appointment.service'

export const useGetAppointments = (search?: string) => {
  const { user, isAuthenticated } = useAuth()

  return useInfiniteQuery({
    queryKey: ['appointments', user?.userId, search],
    queryFn: ({ pageParam }) => appointmentService.getAppointments(pageParam, 5, search),
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined
    }
  })
}
