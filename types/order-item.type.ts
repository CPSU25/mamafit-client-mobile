import { AddOnOptionItem } from '~/features/order/types'
import { OrderItemType } from './order.type'

export interface OrderItemTemp<T> {
  type: OrderItemType
  items: Record<string, T>
}

export interface PresetInStorage {
  presetId: string
  quantity: number
  options: AddOnOptionItem[]
}

export interface ReadyToBuyInStorage {
  maternityDressDetailId: string
  quantity: number
  options: AddOnOptionItem[]
}
