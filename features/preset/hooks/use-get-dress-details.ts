import { useQueries } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import dressService from '~/services/dress.service'

export const useGetDressDetails = (dressDetailIds: string[], enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  const dressDetailQueries = useQueries({
    queries: dressDetailIds.map((dressDetailId) => ({
      queryKey: ['dress-detail', dressDetailId, user?.userId],
      queryFn: () => dressService.getDressDetail(dressDetailId),
      enabled: isAuthenticated && enabled
    }))
  })

  const isLoading = dressDetailQueries.some((query) => query.isLoading)
  const isError = dressDetailQueries.some((query) => query.isError)

  return {
    dressDetails: dressDetailQueries.map((query) => query.data).filter((dressDetail) => dressDetail != null),
    isLoading,
    isError,
    refetch: () => dressDetailQueries.forEach((query) => query.refetch()),
    isRefetching: dressDetailQueries.some((query) => query.isRefetching)
  }
}
