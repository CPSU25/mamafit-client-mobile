import { useQuery } from '@tanstack/react-query'
import componentService from '~/services/component.service'

export const useGetComponentsByStyleId = (styleId: string) => {
  return useQuery({
    queryKey: ['components', styleId],
    queryFn: () => componentService.getComponentsByStyleId(styleId),
    enabled: !!styleId
  })
}
