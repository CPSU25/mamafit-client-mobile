import {
  PlaceDesignRequestOrderFormSchema,
  PlaceDressOrderFormSchema,
  PlacePresetOrderFormSchema
} from '~/features/order/validations'
import { api } from '~/lib/axios/axios'
import { AddOn } from '~/types/add-on.type'
import { BasePaginationResponse, BaseResponse } from '~/types/common'
import { Measurement } from '~/types/diary.type'
import {
  Branch,
  DesignerInfo,
  DesignRequest,
  Order,
  OrderDetail,
  OrderItem,
  OrderItemMilestone,
  OrderStatus,
  OrderStatusCount,
  QRCodeResponse
} from '~/types/order.type'
import { PresetWithComponentOptions } from '~/types/preset.type'

class OrderService {
  async placeDesignRequestOrder(designRequest: PlaceDesignRequestOrderFormSchema) {
    const { data } = await api.post<BaseResponse<string>>('order/design-request', designRequest)

    return data.data
  }

  async placePresetOrder(presetOrder: Omit<PlacePresetOrderFormSchema, 'measurementDiaryId'>) {
    const { data } = await api.post<BaseResponse<string>>('order/preset', presetOrder)

    return data.data
  }

  async placeDressOrder(dressOrder: PlaceDressOrderFormSchema) {
    const { data } = await api.post<BaseResponse<string>>('order/ready-to-buy', dressOrder)

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
    const { data } = await api.get<BasePaginationResponse<Order>>('order/by-token', {
      params: {
        index: page,
        pageSize,
        status,
        search
      }
    })

    return data.data
  }

  async getOrder(orderId: string) {
    const { data } = await api.get<BaseResponse<OrderDetail>>(`order/${orderId}`)

    return data.data
  }

  async getOrderForFeedback(orderId: string) {
    const { data } = await api.get<BaseResponse<OrderDetail>>(`order/for-feedback/${orderId}`)

    return data.data
  }

  async getOrdersCount() {
    const { data } = await api.get<BaseResponse<OrderStatusCount[]>>('order/my-order-status-counts')

    return data.data
  }

  async getOrderItemMilestones(orderItemId: string) {
    const { data } = await api.get<BaseResponse<OrderItemMilestone[]>>(`milestone/order-item/${orderItemId}`)

    return data.data
  }

  async getDesignerInfo(orderItemId: string) {
    const { data } = await api.get<BaseResponse<DesignerInfo>>(`order-items/designer-info/${orderItemId}`)

    return data.data
  }

  async getDesignRequestPreset(designRequestId: string) {
    const { data } = await api.get<BaseResponse<PresetWithComponentOptions[]>>(
      `preset/design-request/${designRequestId}`
    )

    return data.data
  }

  async getDesignRequest(designRequestId: string) {
    const { data } = await api.get<BaseResponse<DesignRequest>>(`design-request/${designRequestId}`)

    return data.data
  }

  async getLatestMeasurement(diaryId: string) {
    const { data } = await api.get<BaseResponse<Measurement>>(`measurement/lasted/measurement-diary/${diaryId}`)

    return data.data
  }

  async cancelOrder({ orderId, canceledReason }: { orderId: string; canceledReason: string }) {
    const { data } = await api.put<BaseResponse<null>>(`order/${orderId}/cancelled?cancelReason=${canceledReason}`)

    return data.data
  }

  async receiveOrder(orderId: string) {
    const { data } = await api.put<BaseResponse<null>>(`order/${orderId}/received`)

    return data.data
  }

  async getOrderItem(orderItemId: string) {
    const { data } = await api.get<BaseResponse<OrderItem>>(`order-items/${orderItemId}`)

    return data.data
  }
}

const orderService = new OrderService()
export default orderService
