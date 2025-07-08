import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import goongService from '~/services/goong.service'

export const useGetForwardGeocoding = (address: string, enabled = false) => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['forward-geocoding', address, user?.userId],
    queryFn: () => goongService.forwardGeocoding(address),
    enabled: isAuthenticated && !!address && enabled
  })
}
