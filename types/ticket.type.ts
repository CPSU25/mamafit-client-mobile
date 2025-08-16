import { Order } from './order.type'

export enum TicketType {
  WarrantyService = 'WARRANTY_SERVICE',
  DeliveryService = 'DELIVERY_SERVICE',
  Other = 'OTHER'
}

export interface Ticket {
  id: string
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
  title: string
  images: string[]
  videos: string[]
  type: TicketType
  description: string
  status: string
  order: Order
}
