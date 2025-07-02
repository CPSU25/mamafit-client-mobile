export interface OrderItem {
  id: string
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
  orderId: string
  maternityDressDetailId: string | null
  itemType: string
  price: number
  quantity: number
  warrantyDate: string | null
  warrantyNumber: number
}
