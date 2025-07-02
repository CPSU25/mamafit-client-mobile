import { CreateRequestSchema } from '~/features/design-request/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'

class OrderService {
  async createDesignRequest(designRequest: CreateRequestSchema) {
    const { data } = await api.post<BaseResponse<string>>('order/design-request', designRequest)

    return data.data
  }
}

const orderService = new OrderService()
export default orderService
