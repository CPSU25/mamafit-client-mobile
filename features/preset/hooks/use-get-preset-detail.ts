import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import presetService from '~/services/preset.service'

export const useGetPresetDetail = (presetId: string | undefined, enabled: boolean, messageId?: string) => {
  const { isAuthenticated, user } = useAuth()
  const key = messageId
    ? ['preset-detail', presetId, , user?.userId, messageId]
    : ['preset-detail', presetId, , user?.userId]

  return useQuery({
    queryKey: key,
    queryFn: () => presetService.getPresetDetail(presetId || ''),
    enabled: isAuthenticated && Boolean(presetId) && enabled
  })
}
