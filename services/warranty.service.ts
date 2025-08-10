import { CreateWarrantyRequestSchema } from '~/features/warranty-request/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'
import { Order, WarrantyRequestDetail } from '~/types/order.type'

class WarrantyService {
  async createWarrantyRequest(warrantyRequest: CreateWarrantyRequestSchema) {
    const { data } = await api.post<BaseResponse<string>>(`warranty-request`, warrantyRequest)

    return data.data
  }

  async getWarrantyRequestDetail(orderId: string) {
    const { data } = await api.get<BaseResponse<WarrantyRequestDetail>>(`warranty-request/original/order/${orderId}`)

    return data.data
  }

  async getOrderRequests() {
    const { data } = await api.get<BaseResponse<Order[]>>('order/for-warranty')

    return data.data
  }
}

const warrantyService = new WarrantyService()
export default warrantyService
