import { api } from '~/lib/axios/axios'
import { BasePaginationResponse, BaseResponse } from '~/types/common'
import { Notification, NotificationType } from '~/types/notification.type'

class NotificationService {
  async getNotifications(page: number = 1, pageSize: number = 10, type?: NotificationType) {
    const url = `/notification/by-token?index=${page}&pageSize=${pageSize}${type ? `&type=${type}` : ''}`

    const { data } = await api.get<BasePaginationResponse<Notification>>(url)

    return data.data
  }

  async markAllAsRead() {
    await api.put<BaseResponse<null>>('notification/marks-all-as-read')
  }
}

const notificationService = new NotificationService()
export default notificationService
