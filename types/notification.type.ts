export enum NotificationTypeRealTime {
  ORDER_PROGRESS,
  APPOINTMENT,
  PAYMENT
}

export enum NotificationTypeDB {
  OrderProgress = 'ORDER_PROGRESS',
  Appointment = 'APPOINTMENT',
  Payment = 'PAYMENT'
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
