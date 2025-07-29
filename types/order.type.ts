import { Address } from './address.type'
import { DirectionResponse } from './common'
import { Preset } from './preset.type'

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

export enum OrderStatus {
  Created = 'CREATED',
  Confirmed = 'CONFIRMED',
  InProduction = 'IN_PRODUCTION',
  InDesign = 'IN_DESIGN',
  AwaitingPaidRest = 'AWAITING_PAID_REST',
  InQC = 'IN_QC',
  InWarranty = 'IN_WARRANTY',
  Packaging = 'PACKAGING',
  Delevering = 'DELIVERING',
  Completed = 'COMPLETED',
  WarrantyCheck = 'WARRANTY_CHECK',
  Cancelled = 'CANCELLED'
}

export enum OrderItemType {
  DesignRequest = 'DESIGN_REQUEST',
  Preset = 'PRESET',
  ReadyToBuy = 'READY_TO_BUY'
}

export interface DesignRequest {
  id: string
  userId: string
  username: string
  description: string
  images: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string | null
}

export interface OrderItem {
  id: string
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
  maternityDressDetail: any | null
  preset: Preset | null
  designRequest: DesignRequest | null
  orderId: string
  maternityDressDetailId: null
  presetId: null
  itemType: OrderItemType
  price: number
  quantity: number
  warrantyDate: string | null
}

export enum OrderType {
  Normal = 'NORMAL',
  Warranty = 'WARRANTY'
}

export enum PaymentStatus {
  Pending = 'PENDING',
  PaidFull = 'PAID_FULL',
  PaidDeposit = 'PAID_DEPOSIT',
  PaidDepositCompleted = 'PAID_DEPOSIT_COMPLETED'
}

export enum DeliveryMethod {
  PickUp = 'PICK_UP',
  Delivery = 'DELIVERY'
}

export enum PaymentMethod {
  Cash = 'CASH',
  OnlineBanking = 'ONLINE_BANKING'
}

export enum PaymentType {
  Full = 'FULL',
  Deposit = 'DEPOSIT'
}

export interface Order {
  id: string
  addressId: string | null
  code: string
  discountSubtotal: number | null
  depositSubtotal: number | null
  remainingBalance: number | null
  totalPaid: number | null
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  branchId: string | null
  userId: string
  voucherDiscountId: string | null
  type: OrderType
  status: OrderStatus
  totalAmount: number
  shippingFee: number
  serviceAmount: number | null
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  deliveryMethod: DeliveryMethod
  paymentType: PaymentType
  canceledAt: string | null
  canceledReason: string | null
  subTotalAmount: number
  warrantyCode: string | null
}

export interface OrderDetail extends Order {
  address: Address | null
  branch: Branch | null
}

export interface OrderStatusCount {
  orderStatus: OrderStatus
  orderNumber: number
}
