import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import goongService from '~/services/goong.service'
import { Vehicle } from '~/types/common'

export const useGetDirection = (origin: string, destination: string, vehicle: Vehicle = Vehicle.Bike) => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['direction', origin, destination, vehicle, user?.userId],
    queryFn: () => goongService.getDirection(origin, destination, vehicle),
    enabled: isAuthenticated && !!origin && !!destination
  })
}
