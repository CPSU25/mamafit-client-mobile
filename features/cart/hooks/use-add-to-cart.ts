import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import cartService from '~/services/cart.service'
import { OrderItemType } from '~/types/order.type'
import { addToCartFormSchema, AddToCartFormSchema } from '../validations'

const defaultValues: AddToCartFormSchema = {
  itemId: '',
  quantity: 1,
  type: OrderItemType.ReadyToBuy
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const methods = useForm<AddToCartFormSchema>({ defaultValues, resolver: zodResolver(addToCartFormSchema) })

  const addToCartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      router.push('/cart')
    }
  })

  return { methods, addToCartMutation }
}
