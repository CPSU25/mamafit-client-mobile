import { useQueries } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetOrderItemsMilestones = (orderItemIds: string[], enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  const milestoneQueries = useQueries({
    queries: orderItemIds.map((orderItemId) => ({
      queryKey: ['order-item-milestones', orderItemId, user?.userId],
      queryFn: () => orderService.getOrderItemMilestones(orderItemId),
      enabled: isAuthenticated && enabled && Boolean(orderItemId)
    }))
  })

  const isLoading = milestoneQueries.some((query) => query.isLoading)
  const isError = milestoneQueries.some((query) => query.isError)

  const milestonesData = milestoneQueries.reduce(
    (acc, query, index) => {
      const orderItemId = orderItemIds[index]
      if (orderItemId && query.data) {
        acc[orderItemId] = query.data
      }
      return acc
    },
    {} as Record<string, any>
  )

  return {
    milestonesData,
    isLoading,
    isError,
    refetch: () => milestoneQueries.forEach((query) => query.refetch()),
    isRefetching: milestoneQueries.some((query) => query.isRefetching)
  }
}
