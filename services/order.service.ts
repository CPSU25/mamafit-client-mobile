import { PlaceDesignRequestOrderFormSchema, PlacePresetOrderFormSchema } from '~/features/order/validations'
import { api } from '~/lib/axios/axios'
import { AddOn } from '~/types/add-on.type'
import { BasePaginationResponse, BaseResponse } from '~/types/common'
import { Branch, OrderStatus, QRCodeResponse } from '~/types/order.type'

class OrderService {
  async placeDesignRequestOrder(designRequest: PlaceDesignRequestOrderFormSchema) {
    const { data } = await api.post<BaseResponse<string>>('order/design-request', designRequest)

    return data.data
  }

  async placePresetOrder(presetOrder: PlacePresetOrderFormSchema) {
    const { data } = await api.post<BaseResponse<string>>('order/preset', presetOrder)

    return data.data
  }

  async getBranches(index: number = 1, pageSize: number = 20) {
    const { data } = await api.get<BasePaginationResponse<Branch>>(
      `branch?index=${index}&pageSize=${pageSize}&sortBy=CREATED_AT_DESC`
    )

    return data.data.items
  }

  async getQRCode(orderId: string) {
    const { data } = await api.get<BaseResponse<QRCodeResponse>>(`sepay-auth/generate-qr/${orderId}`)

    return data.data
  }

  async getPaymentStatus(orderId: string) {
    const { data } = await api.get<BaseResponse<null>>(`sepay-auth/status/${orderId}`)

    return data.message
  }

  async getAddOns() {
    const { data } = await api.get<BasePaginationResponse<AddOn>>('add-on')

    return data.data.items
  }

  async getOrders(page: number = 1, pageSize: number = 5, status: OrderStatus, search?: string) {
    const { data } = await api.get<BasePaginationResponse<any>>('order/by-token', {
      params: {
        page,
        pageSize,
        status,
        search
      }
    })

    return data.data
  }
}

const orderService = new OrderService()
export default orderService
