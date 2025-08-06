export enum NotificationType {
  OrderProgress = 'ORDER_PROGRESS',
  Appointment = 'APPOINTMENT',
  Payment = 'PAYMENT'
}

export interface Notification {
  id: string
  actionUrl: string
  createdAt: string
  createdBy: string
  isRead: false
  metadata: Record<string, string>
  notificationContent: string
  notificationTitle: string
  receiverId: string
  type: NotificationType
  updatedAt: string
  updatedBy: string | null
}
