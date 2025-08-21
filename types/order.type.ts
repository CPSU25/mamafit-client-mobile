import { AddOnOption } from './add-on.type'
import { Address } from './address.type'
import { DirectionResponse, User } from './common'
import { DiaryDetail } from './diary.type'
import { DressVariant } from './dress.type'
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
    type: OrderType
    status: OrderStatus
    totalAmount: number
    shippingFee: number
    paymentStatus: PaymentStatus
    paymentMethod: PaymentMethod
    deliveryMethod: DeliveryMethod
    paymentType: PaymentType
    canceledAt: string | null
    canceledReason: string | null
    subTotalAmount: number
    warrantyCode: string | null
    address: Address | null
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
  InProgress = 'IN_PROGRESS',
  AwaitingPaidRest = 'AWAITING_PAID_REST',
  PickUpInProgress = 'PICKUP_IN_PROGRESS',
  AwaitingPaidWarranty = 'AWAITING_PAID_WARRANTY',
  ReceivedAtBranch = 'RECEIVED_AT_BRANCH',
  Packaging = 'PACKAGING',
  Delevering = 'DELIVERING',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Returned = 'RETURNED'
}

export enum OrderItemType {
  DesignRequest = 'DESIGN_REQUEST',
  Preset = 'PRESET',
  ReadyToBuy = 'READY_TO_BUY',
  Warranty = 'WARRANTY'
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
  maternityDressDetail: DressVariant | null
  parentOrderItemId: string | null
  preset: Preset | null
  designRequest: DesignRequest | null
  orderId: string
  maternityDressDetailId: string | null
  presetId: null
  itemType: OrderItemType
  price: number
  quantity: number
  warrantyDate: string | null
  addOnOptions: AddOnOption[]
  warrantyRound: number
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
  trackingOrderCode: string | null
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
  receivedAt: string | null
  subTotalAmount: number
  warrantyCode: string | null
}

export interface OrderDetail extends Order {
  address: Address | null
  branch: Branch | null
  measurementDiary: DiaryDetail | null
}

export interface OrderStatusCount {
  orderStatus: OrderStatus
  orderNumber: number
}

export interface Milestone {
  id: string
  name: string
}

export interface OrderItemMilestone {
  milestone: Milestone
  progress: number // 0 -> 100
  isDone: boolean
  currentTask: {
    id: string
    name: string
  }
}

export interface DesignerInfo {
  designer: User | null
  chatRoomId: string | null
}
