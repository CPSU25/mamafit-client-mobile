import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import presetService from '~/services/preset.service'

export const useGetDefaultPreset = (styleId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['default-preset', styleId, user?.userId],
    queryFn: () => presetService.getDefaultPreset(styleId),
    enabled: !!styleId && isAuthenticated
  })
}
