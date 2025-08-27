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
  warrantyPeriod: number,
  warrantyTime: number
): 'free' | 'expired' | null => {
  if (!selectedOrderItems || selectedOrderItems.length === 0) return null

  const firstSelected = selectedOrderItems[0]
  const owningOrder = Array.isArray(orderRequests)
    ? orderRequests.find((order) => order.items.some((item) => item.id === firstSelected.id))
    : undefined

  if (!owningOrder?.receivedAt) return null

  const { isFree } = calculateWarrantyStatus(owningOrder.receivedAt, warrantyPeriod)
  const hasFreeRequests = (firstSelected?.warrantyRound ?? 0) < warrantyTime

  return isFree && hasFreeRequests ? 'free' : 'expired'
}

export const canSelectOrderItem = (
  orderItem: OrderItem,
  selectedWarrantyType: 'free' | 'expired' | null,
  receivedAt: string,
  warrantyPeriod: number,
  warrantyTime: number
): boolean => {
  if (selectedWarrantyType === null) return true

  const { isFree } = calculateWarrantyStatus(receivedAt, warrantyPeriod)
  const hasFreeRequests = (orderItem?.warrantyRound ?? 0) < warrantyTime
  const currentItemType = isFree && hasFreeRequests ? 'free' : 'expired'

  return selectedWarrantyType === currentItemType
}

export const getWarrantyRequestStatus = (status: WarrantyRequestStatus | undefined) => {
  return status ? requestStatusMap[status] : requestStatusMap[WarrantyRequestStatus.Pending]
}
