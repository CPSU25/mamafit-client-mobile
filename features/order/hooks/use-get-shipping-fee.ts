import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import ghtkService from '~/types/ghtk.service'

export const useGetShippingFee = ({
  province,
  district,
  weight
}: {
  province: string
  district: string
  weight: number
}) => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['shipping-fee', user?.userId, province, district, weight],
    queryFn: () => ghtkService.getShippingFee({ province, district, weight }),
    enabled: isAuthenticated && !!province && !!district && !!weight
  })
}
