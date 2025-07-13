export interface Voucher {
  id: string
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  userId: string
  voucherBatchId: string
  code: string
  status: 'ACTIVE' | 'INACTIVE' | 'USED' | 'EXPIRED'
}

export interface VoucherBatch {
  id: string
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
  batchName: string
  batchCode: string
  description: string
  startDate: string
  endDate: string
  totalQuantity: number
  discountType: 'FIXED' | 'PERCENTAGE'
  discountValue: number
  minimumOrderValue: number
  maximumDiscountValue: number
}

export interface VoucherBatchWithVouchers extends VoucherBatch {
  details: Voucher[]
}

export type FlattenedVoucher = {
  voucherId: string
  voucherBatchId: string
} & Omit<Voucher, 'id' | 'voucherBatchId'> &
  Omit<VoucherBatch, 'id'>
