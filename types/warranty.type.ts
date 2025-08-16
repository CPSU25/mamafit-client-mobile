import { Branch, Order, OrderItem } from './order.type'

export enum WarrantyRequestStatus {
  Pending = 'PENDING',
  Repairing = 'REPAIRING',
  Completed = 'COMPLETED',
  Rejected = 'REJECTED',
  Approved = 'APPROVED',
  PartiallyRejected = 'PARTIALLY_REJECTED',
  Cancelled = 'CANCELLED'
}

export enum WarrantyRequestItemStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  InTransit = 'IN_TRANSIT'
}

export interface WarrantyRequest {
  id: string
  sku: string
  noteInternal: string | null
  requestType: 'FREE' | 'FEE'
  rejectedReason: string | null
  totalFee: number | null
  status: WarrantyRequestStatus
  customer: string | null
  countItem: number
  createdBy: string | null
  updatedBy: string | null
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export interface WarrantyRequestDetail {
  warrantyRequest: WarrantyRequest
  originalOrders: {
    id: string
    code: string
    receivedAt: string | null
    orderItems: OrderItem[]
  }[]
}

export interface WarrantyItem {
  warrantyRequestItems: {
    warrantyRequestId: string
    orderItemId: string
    destinationBranchId: string | null
    destinationBranch: Branch | null
    trackingCode: string | null
    fee: number | null
    rejectedReason: string | null
    description: string
    images: string[]
    videos: string[]
    status: WarrantyRequestItemStatus
    estimateTime: string | null
    destinationType: string
    warrantyRound: number
    warrantyRequest: WarrantyRequest
  }
  parentOrder: Order
}

export interface WarrantyItemList {
  warrantyRequestItems: {
    warrantyRequestId: string
    orderItemId: string
    destinationBranchId: string | null
    destinationBranch: Branch | null
    trackingCode: string | null
    fee: number | null
    rejectedReason: string | null
    description: string
    images: string[]
    videos: string[]
    status: WarrantyRequestItemStatus
    estimateTime: string | null
    destinationType: string
    warrantyRound: number
    warrantyRequest: WarrantyRequest
  }
  order: Order
}
