import { CreateWarrantyRequestSchema } from '~/features/warranty-request/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'
import { WarrantyRequest } from '~/types/order.type'

class WarrantyService {
  async createWarrantyRequest(warrantyRequest: CreateWarrantyRequestSchema) {
    const { data } = await api.post<BaseResponse<string>>(`warranty-request`, warrantyRequest)

    return data.data
  }

  async getWarrantyRequests(orderItemId: string) {
    const { data } = await api.get<BaseResponse<WarrantyRequest>>(`warranty-request/order-item/${orderItemId}`)

    return data.data
  }
}

const warrantyService = new WarrantyService()
export default warrantyService
