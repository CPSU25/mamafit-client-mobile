export enum NotificationTypeRealTime {
  ORDER_PROGRESS,
  ASSIGNMENT,
  APPOINTMENT,
  VOUCHER,
  PAYMENT,
  MEASUREMENT,
  WARRANTY
}

export enum NotificationTypeDB {
  OrderProgress = 'ORDER_PROGRESS',
  Appointment = 'APPOINTMENT',
  Payment = 'PAYMENT',
  Measurement = 'MEASUREMENT',
  Assignment = 'ASSIGNMENT',
  Voucher = 'VOUCHER',
  Warranty = 'WARRANTY'
}

export interface Notification<T> {
  id: string
  actionUrl: string
  createdAt: string
  createdBy: string
  isRead: false
  metadata: Record<string, string>
  notificationContent: string
  notificationTitle: string
  receiverId: string
  type: T
  updatedAt: string
  updatedBy: string | null
}
