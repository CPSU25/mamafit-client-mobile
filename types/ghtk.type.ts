export interface GHTKFeeResponse {
  fee: {
    name: string
    fee: number
    insuranceFee: number
    deliveryType: string
    a: number
    dt: string
    extFees: any[]
    delivery: boolean
  }
  success: boolean
  message: string
}
