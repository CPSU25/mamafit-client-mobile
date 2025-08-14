import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import cartService from '~/services/cart.service'

export const useGetCart = () => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['cart', user?.userId],
    queryFn: cartService.getCart,
    enabled: isAuthenticated
  })
}
