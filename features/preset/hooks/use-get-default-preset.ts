import { useQuery } from '@tanstack/react-query'
import presetService from '~/services/preset.service'

export const useGetDefaultPreset = (styleId: string) => {
  return useQuery({
    queryKey: ['default-preset', styleId],
    queryFn: () => presetService.getDefaultPreset(styleId),
    enabled: !!styleId
  })
}
