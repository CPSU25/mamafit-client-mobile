import { OrderItem } from './order.type'

export interface Feedback {
  id: string
  userId: string
  orderId: string
  orderCode: string
  description: string
  images: string[]
  rated: number
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderItemWithFeedback extends OrderItem {
  feedbacks: Feedback[]
}
