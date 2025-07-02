import { CreateRequestSchema } from '~/features/design-request/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'
import { QRCodeResponse } from '~/types/order.type'

class OrderService {
  async createDesignRequest(designRequest: CreateRequestSchema) {
    const { data } = await api.post<BaseResponse<string>>('order/design-request', designRequest)

    return data.data
  }

  async getQRCode(orderId: string) {
    const { data } = await api.get<BaseResponse<QRCodeResponse>>(`sepay-auth/generate-qr/${orderId}`)

    return data.data
  }
}

const orderService = new OrderService()
export default orderService
