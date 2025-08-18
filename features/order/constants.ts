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
    label: 'Chờ thanh toán',
    value: OrderStatus.Created,
    urlValue: 'to-pay',
    title: 'Đang chờ thanh toán',
    description:
      'Đơn hàng của bạn đã được đặt thành công và đang chờ bạn hoàn tất thanh toán để chúng tôi bắt đầu chuẩn bị.'
  },
  {
    id: 2,
    label: 'Xác nhận',
    value: OrderStatus.Confirmed,
    urlValue: 'confirmed',
    title: 'Đơn hàng đã xác nhận',
    description:
      'Chúng tôi đã nhận được thanh toán của bạn và xác nhận đơn hàng. Đội ngũ của chúng tôi đang chuẩn bị mọi thứ để tiến hành sản xuất.'
  },
  {
    id: 4,
    label: 'Đang xử lý',
    value: OrderStatus.InProgress,
    urlValue: 'in-progress',
    title: 'Đang xử lý',
    description:
      'Đơn hàng của bạn đang được xử lý. Đội ngũ của chúng tôi đang làm việc cẩn thận để đảm bảo mọi thứ đạt chuẩn chất lượng.'
  },
  {
    id: 6,
    label: 'Thanh toán cọc',
    value: OrderStatus.AwaitingPaidRest,
    urlValue: 'to-pay-rest',
    title: 'Đang chờ thanh toán còn lại',
    description:
      'Đơn hàng của bạn đã vượt qua tất cả kiểm tra chất lượng. Vui lòng thanh toán phần còn lại để chúng tôi chuẩn bị giao hàng cho bạn.'
  },
  {
    id: 7,
    label: 'Thanh toán bảo hành',
    value: OrderStatus.AwaitingPaidWarranty,
    urlValue: 'to-pay-warranty',
    title: 'Đang chờ thanh toán bảo hành',
    description: 'Vui lòng hoàn tất thanh toán để chúng tôi tiếp tục quy trình bảo hành.'
  },
  {
    id: 8,
    label: 'Đang đóng gói',
    value: OrderStatus.Packaging,
    urlValue: 'packaging',
    title: 'Đang đóng gói',
    description: 'Đơn hàng của bạn đang được đóng gói cẩn thận để đảm bảo đến tay bạn an toàn và nguyên vẹn.'
  },
  {
    id: 9,
    label: 'Đang giao hàng',
    value: OrderStatus.Delevering,
    urlValue: 'to-deliver',
    title: 'Đang giao hàng',
    description: 'Đơn hàng đã được đóng gói và đang trên đường giao tới địa chỉ của bạn.'
  },
  {
    id: 10,
    label: 'Đang lấy hàng',
    value: OrderStatus.PickUpInProgress,
    urlValue: 'pick-up-in-progress',
    title: 'Đang chuẩn bị lấy hàng',
    description: 'Đơn hàng của bạn đang được chuẩn bị để gửi đến nhà máy cho dịch vụ bảo hành.'
  },
  {
    id: 11,
    label: 'Chờ lấy hàng',
    value: OrderStatus.ReceivedAtBranch,
    urlValue: 'received-at-branch',
    title: 'Chờ lấy hàng',
    description: 'Đơn hàng đã đến chi nhánh và sẵn sàng để bạn nhận theo thời gian thuận tiện.'
  },
  {
    id: 12,
    label: 'Đã nhận hàng',
    value: OrderStatus.Completed,
    urlValue: 'to-rate',
    title: 'Đã hoàn thành đơn hàng',
    description:
      'Đơn hàng của bạn đã được giao thành công. Vui lòng xác nhận đã nhận và chia sẻ phản hồi với chúng tôi.'
  },
  {
    id: 13,
    label: 'Đã hủy',
    value: OrderStatus.Cancelled,
    urlValue: 'cancelled',
    title: 'Đơn hàng đã hủy',
    description:
      'Đơn hàng của bạn đã bị hủy. Nếu cần hỗ trợ hoặc muốn đặt lại, vui lòng liên hệ bộ phận chăm sóc khách hàng.'
  },
  {
    id: 14,
    label: 'Đã trả hàng',
    value: OrderStatus.Returned,
    urlValue: 'returned',
    title: 'Đơn hàng đã trả',
    description:
      'Đơn hàng của bạn đã được trả lại cho chúng tôi. Vui lòng liên hệ bộ phận hỗ trợ nếu cần trợ giúp hoặc thêm thông tin.'
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
