import { OrderRatingSchema } from '~/features/feedback/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'
import { OrderItemWithFeedback } from '~/types/feedback.type'
import { Order } from '~/types/order.type'

class FeedbackService {
  async rateOrder(input: OrderRatingSchema[]) {
    const { data } = await api.post<BaseResponse<null>>('feedback', input)

    return data.data
  }

  async getFeedbackStatus(orderId: string) {
    const { data } = await api.get<BaseResponse<boolean>>(`feedback/feedback-status/${orderId}`)

    return data.data
  }

  async getRatedOrders() {
    const { data } = await api.get<BaseResponse<OrderItemWithFeedback[]>>('feedback/my-feedbacks')

    return data.data?.sort(
      (a, b) => new Date(b.feedbacks[0].createdAt).getTime() - new Date(a.feedbacks[0].createdAt).getTime()
    )
  }

  async getUnratedOrders() {
    const { data } = await api.get<BaseResponse<Order[]>>('order/for-feedback')

    return data.data
  }
}

const feedbackService = new FeedbackService()
export default feedbackService
