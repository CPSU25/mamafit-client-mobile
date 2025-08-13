import { OrderStatus } from '~/types/order.type'
import { AddOnImageConfig, OrderStatusType } from './types'

export const ADD_ON_IMAGE_CONFIG: Record<string, AddOnImageConfig> = {
  Embroidery: {
    url: require('~/assets/icons/embroidery.png'),
    color: '#FFEAF2',
    textColor: '#BE185D'
  },
  'Pattern Printing': {
    url: require('~/assets/icons/pattern-printing.png'),
    color: '#E1FBF2',
    textColor: '#10B981'
  },
  'Rhinestone Attachment': {
    url: require('~/assets/icons/rhinestone.png'),
    color: '#F3FEFA',
    textColor: '#14B8A6'
  },
  'Lace Applique': {
    url: require('~/assets/icons/lace.png'),
    color: '#E8F2FF',
    textColor: '#2563EB'
  },
  'Bead Attachment': {
    url: require('~/assets/icons/beads.png'),
    color: '#FAF8FF',
    textColor: '#7C3AED'
  },
  'Personal Tag Attachment': {
    url: require('~/assets/icons/personal-tag.png'),
    color: '#FFFBE6',
    textColor: '#EA580C'
  }
} as const

export const DEFAULT_ADD_ON_IMAGE: AddOnImageConfig = {
  url: require('~/assets/icons/more.png'),
  color: '#E6EDFF',
  textColor: '#2563EB'
} as const

export const ORDERED_SIZES = ['Small', 'Medium', 'Large', 'Full Position']

export const ORDERED_TYPES = ['TEXT', 'IMAGE', 'PATTERN']

export const ORDER_STATUS_TYPES: OrderStatusType[] = [
  {
    id: 1,
    label: 'To Pay',
    value: OrderStatus.Created,
    urlValue: 'to-pay',
    title: 'Waiting For Payment',
    description:
      'Your order has been placed successfully and is waiting for you to complete the payment so we can begin preparing it.'
  },
  {
    id: 2,
    label: 'Confirmed',
    value: OrderStatus.Confirmed,
    urlValue: 'to-make',
    title: 'Order Confirmed',
    description:
      'We have received your payment and confirmed your order. Our team is getting everything ready to start making it.'
  },
  {
    id: 4,
    label: 'In Progress',
    value: OrderStatus.InProgress,
    urlValue: 'in-progress',
    title: 'In Progress',
    description:
      'Your order is now in progress. Our team is carefully working on it to make sure everything meets our quality standards.'
  },
  {
    id: 6,
    label: 'To Pay Rest',
    value: OrderStatus.AwaitingPaidRest,
    urlValue: 'to-pay-rest',
    title: 'Waiting For Remaining Payment',
    description:
      'Your order has passed all quality checks. Please pay the remaining balance so we can prepare it for shipping to you.'
  },
  {
    id: 7,
    label: 'To Pay Warranty',
    value: OrderStatus.AwaitingPaidWarranty,
    urlValue: 'to-pay-warranty',
    title: 'Waiting For Warranty Payment',
    description: 'Please complete the payment so we can continue with the warranty process.'
  },
  {
    id: 8,
    label: 'Packaging',
    value: OrderStatus.Packaging,
    urlValue: 'packaging',
    title: 'Packaging',
    description: 'Your order is being carefully packaged to ensure it arrives safely and in perfect condition.'
  },
  {
    id: 9,
    label: 'To Deliver',
    value: OrderStatus.Delevering,
    urlValue: 'to-deliver',
    title: 'Out For Delivery',
    description: 'Your packaged order is now with the courier and on its way to your delivery address.'
  },
  {
    id: 10,
    label: 'To Factory',
    value: OrderStatus.PickUpInProgress,
    urlValue: 'pick-up-in-progress',
    title: 'To Factory',
    description: 'Your order is being prepared for pickup and will be sent to the factory for warranty service.'
  },
  {
    id: 11,
    label: 'To Pick Up',
    value: OrderStatus.ReceivedAtBranch,
    urlValue: 'received-at-branch',
    title: 'To Pick Up',
    description: 'Your order has arrived at the branch and is ready for you to collect at your convenience.'
  },
  {
    id: 12,
    label: 'Completed',
    value: OrderStatus.Completed,
    urlValue: 'to-rate',
    title: 'Order Completed',
    description:
      'Your order has been successfully delivered. Please confirm you have received it and share your feedback with us.'
  },
  {
    id: 13,
    label: 'Cancelled',
    value: OrderStatus.Cancelled,
    urlValue: 'cancelled',
    title: 'Order Cancelled',
    description:
      'Your order has been cancelled. If you have any questions or would like to place it again, please contact our support team.'
  },
  {
    id: 14,
    label: 'Returned',
    value: OrderStatus.Returned,
    urlValue: 'returned',
    title: 'Order Returned',
    description:
      'Your order has been returned to us. Please reach out to our support team if you need assistance or more details.'
  }
]

export const statusStyles: Record<
  OrderStatus,
  { colors: [string, string, string]; textColor: string; iconColor: string; shadowColor: string }
> = {
  CREATED: {
    colors: ['#fff9e3', '#fef7d8', '#fbbf24'],
    textColor: '#7c2d12',
    iconColor: '#ca8a04',
    shadowColor: '#eab308'
  },
  CONFIRMED: {
    colors: ['#f3fbf6', '#d1fae5', '#059669'],
    textColor: '#166534',
    iconColor: '#16a34a',
    shadowColor: '#22c55e'
  },
  IN_PROGRESS: {
    colors: ['#fff6ea', '#ffe9d6', '#ea580c'],
    textColor: '#9a3412',
    iconColor: '#ea580c',
    shadowColor: '#f97316'
  },
  AWAITING_PAID_REST: {
    colors: ['#faf4ff', '#f3e8ff', '#a21caf'],
    textColor: '#701a75',
    iconColor: '#c026d3',
    shadowColor: '#d946ef'
  },
  PACKAGING: {
    colors: ['#f6f8fa', '#e2e8f0', '#334155'],
    textColor: '#334155',
    iconColor: '#475569',
    shadowColor: '#64748b'
  },
  DELIVERING: {
    colors: ['#f2fdfa', '#ccfbf1', '#0e7490'],
    textColor: '#115e59',
    iconColor: '#0d9488',
    shadowColor: '#14b8a6'
  },
  COMPLETED: {
    colors: ['#f3fbf6', '#d1fae5', '#059669'],
    textColor: '#166534',
    iconColor: '#16a34a',
    shadowColor: '#22c55e'
  },
  AWAITING_PAID_WARRANTY: {
    colors: ['#fffaeb', '#fef9c3', '#b45309'],
    textColor: '#854d0e',
    iconColor: '#ca8a04',
    shadowColor: '#eab308'
  },
  PICKUP_IN_PROGRESS: {
    colors: ['#f0f9ff', '#bae6fd', '#0284c7'],
    textColor: '#075985',
    iconColor: '#0ea5e9',
    shadowColor: '#38bdf8'
  },
  RECEIVED_AT_BRANCH: {
    colors: ['#f3f4f6', '#e5e7eb', '#374151'],
    textColor: '#1f2937',
    iconColor: '#4b5563',
    shadowColor: '#6b7280'
  },
  CANCELLED: {
    colors: ['#fff5f5', '#ffe4e6', '#dc2626'],
    textColor: '#991b1b',
    iconColor: '#dc2626',
    shadowColor: '#ef4444'
  },
  RETURNED: {
    colors: ['#f3fbf6', '#d1fae5', '#059669'],
    textColor: '#166534',
    iconColor: '#16a34a',
    shadowColor: '#22c55e'
  }
}
