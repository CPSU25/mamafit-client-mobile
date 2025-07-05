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
  type: number
  updatedAt: string
  updatedBy: string | null
}
