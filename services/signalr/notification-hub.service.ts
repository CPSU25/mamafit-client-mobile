import { BaseHubService } from './base-hub.service'

export enum NotificationHubEvents {
  ReceiveNotification = 'ReceiveNotification',
  Error = 'Error'
}

class NotificationHubService extends BaseHubService {
  protected endpoint = 'notificationHub'

  // Store handler reference for cleanup
  private handleReceiveNotification = (notification: any) =>
    this.emit(NotificationHubEvents.ReceiveNotification, notification)

  // Register SignalR event handlers for the notification hub
  protected async initListeners() {
    await this.ensureConnected()

    this.hubConnection!.on(NotificationHubEvents.ReceiveNotification, this.handleReceiveNotification)
    console.log('NotificationHub listeners initialized')
  }

  // Remove all SignalR listeners for the notification hub
  protected async removeAllHubListeners() {
    await this.ensureConnected()

    this.hubConnection!.off(NotificationHubEvents.ReceiveNotification, this.handleReceiveNotification)
  }
}

const notificationHubService = new NotificationHubService()
export default notificationHubService
