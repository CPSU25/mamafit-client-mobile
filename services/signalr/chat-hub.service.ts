import { BaseHubService } from './base-hub.service'

export enum ChatHubEvents {
  ReceiveMessage = 'ReceiveMessage',
  SendMessage = 'SendMessage',
  UserOnline = 'UserOnline',
  UserOffline = 'UserOffline',
  OnlineUsersList = 'OnlineUsersList',
  JoinedRoom = 'JoinedRoom',
  Error = 'Error'
}

interface MessagePayload {
  ChatRoomId: string
  Message: string
  Type: number
}

class ChatHubService extends BaseHubService {
  protected endpoint = 'chatHub'

  // Store handler references for proper cleanup
  private handleReceiveMessage = (message: any) => this.emit(ChatHubEvents.ReceiveMessage, message)
  private handleUserOnline = (userId: string, userName: string) => this.emit(ChatHubEvents.UserOnline, userId, userName)
  private handleUserOffline = (userId: string, userName: string) =>
    this.emit(ChatHubEvents.UserOffline, userId, userName)
  private handleOnlineUsersList = (users: any[]) => this.emit(ChatHubEvents.OnlineUsersList, users)
  private handleJoinedRoom = (roomId: string) => this.emit(ChatHubEvents.JoinedRoom, roomId)
  private handleError = (errorMessage: string) => this.emit(ChatHubEvents.Error, errorMessage)

  // Register SignalR event handlers for the chat hub
  protected async initListeners() {
    await this.ensureConnected()

    this.hubConnection!.on(ChatHubEvents.ReceiveMessage, this.handleReceiveMessage)
    this.hubConnection!.on(ChatHubEvents.UserOnline, this.handleUserOnline)
    this.hubConnection!.on(ChatHubEvents.UserOffline, this.handleUserOffline)
    this.hubConnection!.on(ChatHubEvents.OnlineUsersList, this.handleOnlineUsersList)
    this.hubConnection!.on(ChatHubEvents.JoinedRoom, this.handleJoinedRoom)
    this.hubConnection!.on(ChatHubEvents.Error, this.handleError)

    console.log('ChatHub listeners initialized')
  }

  // Remove all SignalR listeners for the chat hub
  protected async removeAllHubListeners() {
    await this.ensureConnected()

    this.hubConnection!.off(ChatHubEvents.ReceiveMessage, this.handleReceiveMessage)
    this.hubConnection!.off(ChatHubEvents.UserOnline, this.handleUserOnline)
    this.hubConnection!.off(ChatHubEvents.UserOffline, this.handleUserOffline)
    this.hubConnection!.off(ChatHubEvents.OnlineUsersList, this.handleOnlineUsersList)
    this.hubConnection!.off(ChatHubEvents.JoinedRoom, this.handleJoinedRoom)
    this.hubConnection!.off(ChatHubEvents.Error, this.handleError)
  }

  // Send a chat message to a room
  async sendMessage(roomId: string, message: string, type: number): Promise<void> {
    await this.ensureConnected()

    const payload: MessagePayload = { ChatRoomId: roomId, Message: message, Type: type }
    await this.hubConnection!.invoke(ChatHubEvents.SendMessage, payload)
  }
}

const chatHubService = new ChatHubService()
export default chatHubService
