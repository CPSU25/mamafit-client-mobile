import { AddToCartFormSchema, UpdateCartItemFormSchema } from '~/features/cart/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse, CartItem } from '~/types/common'

class CartService {
  async getCart() {
    const { data } = await api.get<BaseResponse<CartItem[]>>('cart-item')

    return data.data
  }

  async addToCart(input: AddToCartFormSchema) {
    const { data } = await api.post<BaseResponse<null>>('cart-item', input)

    return data.data
  }

  async updateCartItem(input: UpdateCartItemFormSchema) {
    const { data } = await api.put<BaseResponse<null>>('cart-item', {
      ...input
    })

    return data.data
  }

  async removeCartItem(itemId: string) {
    const { data } = await api.delete<BaseResponse<null>>(`cart-item/${itemId}`)

    return data.data
  }
}

const cartService = new CartService()
export default cartService
