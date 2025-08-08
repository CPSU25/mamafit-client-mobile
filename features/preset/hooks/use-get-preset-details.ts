import { useQueries } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import presetService from '~/services/preset.service'

export const useGetPresetDetails = (presetIds: string[], enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  const presetQueries = useQueries({
    queries: presetIds.map((presetId) => ({
      queryKey: ['preset-detail', presetId, user?.userId],
      queryFn: () => presetService.getPresetDetail(presetId),
      enabled: isAuthenticated && enabled
    }))
  })

  const isLoading = presetQueries.some((query) => query.isLoading)
  const isError = presetQueries.some((query) => query.isError)

  return {
    presetDetails: presetQueries.map((query) => query.data).filter((preset) => preset != null),
    isLoading,
    isError,
    refetch: () => presetQueries.forEach((query) => query.refetch()),
    isRefetching: presetQueries.some((query) => query.isRefetching)
  }
}
