import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import componentService from '~/services/component.service'

export const useGetComponentsByStyleId = (styleId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['components', styleId, user?.userId],
    queryFn: () => componentService.getComponentsByStyleId(styleId),
    enabled: !!styleId && isAuthenticated
  })
}
