import { Address } from './address.type'
import { DirectionResponse } from './common'
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

export interface Branch {
  id: string
  branchManagerId: string
  name: string
  description: string
  openingHour: string
  closingHour: string
  images: string[]
  mapId: string
  province: string
  district: string
  ward: string
  street: string
  latitude: number
  longitude: number
}

export interface BranchWithDirection extends Branch {
  distance?: number
  duration?: number
  directionData?: DirectionResponse
}
