import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import cartService from '~/services/cart.service'

export const useUpdateCartItem = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const updateCartItemMutation = useMutation({
    mutationFn: cartService.updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.userId] })
    }
  })

  const removeCartItemMutation = useMutation({
    mutationFn: cartService.removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.userId] })
    }
  })

  return {
    updateCartItemMutation,
    removeCartItemMutation
  }
}
