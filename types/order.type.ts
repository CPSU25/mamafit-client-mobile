import { Address } from './address.type'
import { OrderItem } from './order-item.type'

export interface QRCodeResponse {
  qrUrl: string
  orderWithItem: {
    id: string
    parentOrderId: string | null
    code: string
    branchId: string | null
    userId: string
    addressId: string
    voucherDiscountId: string | null
    type: string
    status: string
    totalAmount: number
    shippingFee: number
    paymentStatus: string
    paymentMethod: string
    deliveryMethod: string
    paymentType: string
    canceledAt: string | null
    canceledReason: string | null
    subTotalAmount: number
    warrantyCode: string | null
    address: Address
    createdBy: string
    updatedBy: string | null
    createdAt: string
    updatedAt: string
    orderItems: OrderItem[]
  }
}
