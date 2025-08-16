import { CreateWarrantyRequestSchema } from '~/features/warranty-request/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'
import { Order } from '~/types/order.type'
import { WarrantyItem, WarrantyItemList, WarrantyRequestDetail } from '~/types/warranty.type'

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

  async getWarrantyItemByOrderItem(orderItemId: string) {
    const { data } = await api.get<BaseResponse<WarrantyItem>>(`warranty-request-item/order-item/${orderItemId}`)

    return data.data
  }

  async getWarrantyItemsByOrderItem(orderItemId: string) {
    const { data } = await api.get<BaseResponse<WarrantyItemList[]>>(
      `warranty-request-item/order-item-list/${orderItemId}`
    )

    return data.data?.map((warrantyItem) => ({
      ...warrantyItem,
      order: {
        ...warrantyItem.order,
        items: warrantyItem.order.items.filter(
          (orderItem) => orderItem.id === orderItemId || orderItem.id === warrantyItem.warrantyRequestItems?.orderItemId
        )
      }
    }))
  }
}

const warrantyService = new WarrantyService()
export default warrantyService
