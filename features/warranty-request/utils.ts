import { addDays, differenceInDays, parseISO } from 'date-fns'
import { Order, OrderItem } from '~/types/order.type'
import { WarrantyRequestStatus } from '~/types/warranty.type'
import { requestStatusMap } from './constants'

export const calculateWarrantyStatus = (receivedAt: string, period: number) => {
  const difference = differenceInDays(addDays(parseISO(receivedAt), period), new Date())
  const isFree = difference > 0

  return {
    isFree,
    daysLeft: difference,
    isExpired: !isFree
  }
}

export const getWarrantyType = (
  selectedOrderItems: OrderItem[] | null,
  orderRequests: Order[] | null | undefined,
  warrantyPeriod: number
): 'free' | 'expired' | null => {
  if (!selectedOrderItems || selectedOrderItems.length === 0) return null

  const firstSelected = selectedOrderItems[0]
  const owningOrder = Array.isArray(orderRequests)
    ? orderRequests.find((order) => order.items.some((item) => item.id === firstSelected.id))
    : undefined

  if (!owningOrder?.receivedAt) return null

  const { isFree } = calculateWarrantyStatus(owningOrder.receivedAt, warrantyPeriod)
  return isFree ? 'free' : 'expired'
}

export const canSelectOrderItem = (
  orderItem: OrderItem,
  selectedWarrantyType: 'free' | 'expired' | null,
  receivedAt: string,
  warrantyPeriod: number
): boolean => {
  if (selectedWarrantyType === null) return true

  const { isFree } = calculateWarrantyStatus(receivedAt, warrantyPeriod)
  const currentItemType = isFree ? 'free' : 'expired'

  return selectedWarrantyType === currentItemType
}

export const getWarrantyRequestStatus = (status: WarrantyRequestStatus | undefined) => {
  return status ? requestStatusMap[status] : requestStatusMap[WarrantyRequestStatus.Pending]
}
