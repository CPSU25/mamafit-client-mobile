import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'
import { OrderStatus } from '~/types/order.type'

export const useGetOrders = (status: OrderStatus, search?: string) => {
  const { user, isAuthenticated } = useAuth()

  return useInfiniteQuery({
    queryKey: ['orders', user?.userId, status, search],
    queryFn: ({ pageParam }) => orderService.getOrders(pageParam, 5, status, search),
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined
    }
  })
}
