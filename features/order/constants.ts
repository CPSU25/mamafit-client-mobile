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
    title: 'Đơn hàng đang chờ thanh toán',
    description:
      'Đơn hàng của bạn đã được ghi nhận. Vui lòng hoàn tất thanh toán để chúng tôi bắt đầu chuẩn bị hoặc tiến hành thiết kế sản phẩm.'
  },
  {
    id: 2,
    label: 'Xác nhận',
    value: OrderStatus.Confirmed,
    urlValue: 'confirmed',
    title: 'Đơn hàng đã được xác nhận',
    description:
      'Thanh toán đã thành công và đơn hàng được xác nhận. Chúng tôi đang chuẩn bị hàng có sẵn hoặc khởi động quy trình thiết kế theo yêu cầu.'
  },
  {
    id: 4,
    label: 'Đang xử lý',
    value: OrderStatus.InProgress,
    urlValue: 'in-progress',
    title: 'Đơn hàng đang được xử lý',
    description:
      'Đơn hàng của bạn đang trong quá trình xử lý. Với hàng có sẵn chúng tôi kiểm tra chất lượng, với thiết kế chúng tôi tiến hành sản xuất theo yêu cầu.'
  },
  {
    id: 6,
    label: 'Thanh toán cọc',
    value: OrderStatus.AwaitingPaidRest,
    urlValue: 'to-pay-rest',
    title: 'Chờ thanh toán phần còn lại',
    description:
      'Đơn hàng đã hoàn tất các khâu chính. Vui lòng thanh toán số tiền còn lại để chúng tôi sắp xếp giao hàng cho bạn.'
  },
  {
    id: 7,
    label: 'Thanh toán bảo hành',
    value: OrderStatus.AwaitingPaidWarranty,
    urlValue: 'to-pay-warranty',
    title: 'Chờ thanh toán phí bảo hành',
    description:
      'Để tiếp tục xử lý yêu cầu bảo hành, vui lòng hoàn tất phí cần thiết. Sau khi xác nhận chúng tôi sẽ tiến hành ngay.'
  },
  {
    id: 8,
    label: 'Đang đóng gói',
    value: OrderStatus.Packaging,
    urlValue: 'packaging',
    title: 'Đơn hàng đang được đóng gói',
    description: 'Sản phẩm của bạn đang được kiểm tra và đóng gói cẩn thận để chuẩn bị vận chuyển.'
  },
  {
    id: 9,
    label: 'Đến nhà máy',
    value: OrderStatus.PickUpInProgress,
    urlValue: 'pick-up-in-progress',
    title: 'Shipper đang đến lấy hàng',
    description: 'Nhân viên vận chuyển đang đến địa chỉ của bạn để nhận sản phẩm và gửi về xưởng xử lý hoặc bảo hành.'
  },
  {
    id: 10,
    label: 'Tại chi nhánh',
    value: OrderStatus.ReceivedAtBranch,
    urlValue: 'received-at-branch',
    title: 'Đơn hàng đã có tại chi nhánh',
    description: 'Đơn hàng của bạn đã được chuyển đến chi nhánh gần nhất và sẵn sàng bàn giao.'
  },
  {
    id: 11,
    label: 'Đang giao hàng',
    value: OrderStatus.Delevering,
    urlValue: 'to-deliver',
    title: 'Đơn hàng đang trong quá trình giao',
    description: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển và đang trên đường đến địa chỉ của bạn.'
  },
  {
    id: 12,
    label: 'Đã hoàn tất',
    value: OrderStatus.Completed,
    urlValue: 'to-rate',
    title: 'Đơn hàng đã hoàn tất',
    description: 'Bạn đã nhận thành công đơn hàng. Vui lòng xác nhận và để lại đánh giá của bạn.'
  },
  {
    id: 13,
    label: 'Đã hủy',
    value: OrderStatus.Cancelled,
    urlValue: 'cancelled',
    title: 'Đơn hàng đã được hủy',
    description: 'Đơn hàng đã bị hủy. Nếu bạn muốn đặt lại hoặc cần hỗ trợ, vui lòng liên hệ CSKH.'
  },
  {
    id: 14,
    label: 'Đã trả hàng',
    value: OrderStatus.Returned,
    urlValue: 'returned',
    title: 'Đơn hàng đã được trả lại',
    description: 'Đơn hàng đã được hoàn tất thủ tục trả lại. Vui lòng liên hệ CSKH nếu bạn cần thêm hỗ trợ.'
  }
]

export const FEEDBACK_STATUS_TYPES = [
  {
    id: 1,
    label: 'Chưa đánh giá',
    urlValue: 'unrated'
  },
  {
    id: 2,
    label: 'Đã đánh giá',
    urlValue: 'rated'
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
