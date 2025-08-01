import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import presetService from '~/services/preset.service'

export const useGetPresetDetail = (presetId: string | undefined, enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['preset-detail', user?.userId],
    queryFn: () => presetService.getPresetDetail(presetId || ''),
    enabled: isAuthenticated && !!presetId && enabled
  })
}
