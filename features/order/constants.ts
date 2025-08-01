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
      'Your order has been created and is waiting for you to complete the payment so we can start processing.'
  },
  {
    id: 2,
    label: 'Confirmed',
    value: OrderStatus.Confirmed,
    urlValue: 'to-make',
    title: 'Order Confirmed',
    description:
      'Your payment was confirmed and your order has been accepted. We are preparing everything to start making it.'
  },
  {
    id: 3,
    label: 'In Design',
    value: OrderStatus.InDesign,
    urlValue: 'in-design',
    title: 'Design In Progress',
    description:
      'Our designer is now working closely with you to finalize the design before your order goes to production.'
  },
  {
    id: 4,
    label: 'In Production',
    value: OrderStatus.InProduction,
    urlValue: 'in-production',
    title: 'In Production',
    description:
      'Your order is currently being produced by our team with care and attention before it moves to the next step.'
  },
  {
    id: 5,
    label: 'In QC',
    value: OrderStatus.InQC,
    urlValue: 'in-qc',
    title: 'Quality Check',
    description:
      'Your order has been completed and is now undergoing a strict quality check to ensure everything is perfect.'
  },
  {
    id: 6,
    label: 'To Pay Rest',
    value: OrderStatus.AwaitingPaidRest,
    urlValue: 'to-pay-rest',
    title: 'Waiting For Remaining Payment',
    description:
      'Your order passed the quality check. Please pay the remaining balance so we can prepare it for delivery soon.'
  },
  {
    id: 7,
    label: 'Packaging',
    value: OrderStatus.Packaging,
    urlValue: 'packaging',
    title: 'Being Packaged',
    description:
      'Your order has passed all checks and is now being carefully packaged and made ready to be sent to you.'
  },
  {
    id: 8,
    label: 'To Deliver',
    value: OrderStatus.Delevering,
    urlValue: 'to-deliver',
    title: 'Out For Delivery',
    description:
      'Your packaged order has been handed to the delivery courier and is on its way to the address you provided.'
  },
  {
    id: 9,
    label: 'Completed',
    value: OrderStatus.Completed,
    urlValue: 'to-rate',
    title: 'Order Completed',
    description:
      'Your order has been successfully delivered. Please confirm that you received it and leave your feedback.'
  },
  {
    id: 10,
    label: 'Warranty Check',
    value: OrderStatus.WarrantyCheck,
    urlValue: 'warranty-check',
    title: 'Warranty Inspection',
    description:
      'We are reviewing your request and checking your order to confirm if it is eligible to receive warranty service.'
  },
  {
    id: 11,
    label: 'In Warranty',
    value: OrderStatus.InWarranty,
    urlValue: 'in-warranty',
    title: 'Warranty Service',
    description:
      'Your order is being repaired or replaced under warranty and will pass checks again before being delivered.'
  },
  {
    id: 12,
    label: 'Cancelled',
    value: OrderStatus.Cancelled,
    urlValue: 'cancelled',
    title: 'Order Cancelled',
    description:
      'Your order has been cancelled. Please contact us if you have any questions or need further assistance.'
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
  IN_DESIGN: {
    colors: ['#f6f0ff', '#e9d6fd', '#7c3aed'],
    textColor: '#5b21b6',
    iconColor: '#7c3aed',
    shadowColor: '#8b5cf6'
  },
  CONFIRMED: {
    colors: ['#f3fbf6', '#d1fae5', '#059669'],
    textColor: '#166534',
    iconColor: '#16a34a',
    shadowColor: '#22c55e'
  },
  IN_PRODUCTION: {
    colors: ['#fff6ea', '#ffe9d6', '#ea580c'],
    textColor: '#9a3412',
    iconColor: '#ea580c',
    shadowColor: '#f97316'
  },
  IN_QC: {
    colors: ['#f4f7fd', '#e0e7ff', '#2563eb'],
    textColor: '#1e3a8a',
    iconColor: '#2563eb',
    shadowColor: '#3b82f6'
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
  WARRANTY_CHECK: {
    colors: ['#fff5f5', '#ffe4e6', '#dc2626'],
    textColor: '#991b1b',
    iconColor: '#dc2626',
    shadowColor: '#ef4444'
  },
  IN_WARRANTY: {
    colors: ['#fffaeb', '#fef9c3', '#b45309'],
    textColor: '#854d0e',
    iconColor: '#ca8a04',
    shadowColor: '#eab308'
  },
  CANCELLED: {
    colors: ['#fff5f5', '#ffe4e6', '#dc2626'],
    textColor: '#991b1b',
    iconColor: '#dc2626',
    shadowColor: '#ef4444'
  }
}
