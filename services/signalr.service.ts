import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr'
import * as SecureStore from 'expo-secure-store'

class SignalRService {
  private hubConnection: HubConnection | null = null
  private accessToken = ''
  private listeners = new Map<string, ((...args: unknown[]) => void)[]>()

  private readonly wsUrl = process.env.EXPO_PUBLIC_API_WS_URL
  private readonly chatEndpoint = 'chatHub'
  private readonly authKey = 'auth-storage'

  constructor() {
    this.getAccessToken()
  }

  private async init() {
    if (!this.wsUrl) {
      throw new Error('EXPO_PUBLIC_API_WS_URL is not set')
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`${this.wsUrl}/${this.chatEndpoint}`, {
        accessTokenFactory: () => this.accessToken,
        transport: HttpTransportType.WebSockets,
        skipNegotiation: false,
        withCredentials: false
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    console.log('Connection initialized')
    return connection
  }

  get isConnected() {
    return this.hubConnection?.state === HubConnectionState.Connected
  }

  async connect() {
    if (!this.hubConnection) {
      this.hubConnection = await this.init()
      this.initListeners()
    }

    try {
      await this.hubConnection.start()
      console.log('SignalR connected')
    } catch (error) {
      console.error('SignalR connect error', error)
      this.emit('Error', (error as Error).message)
    }
  }

  async disconnect() {
    if (this.hubConnection) {
      await this.hubConnection.stop()
      console.log('SignalR disconnected')
    }
  }

  // Chat
  async sendMessage(roomId: string, message: string) {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      await this.connect()
    }

    try {
      await this.hubConnection!.invoke('SendMessage', {
        ChatRoomId: roomId,
        Message: message,
        Type: 0 // 0: Text
      })
    } catch (err) {
      console.error('SignalR send error', err)
      this.emit('Error', (err as Error).message)
    }
  }

  async joinRoom(roomId: string) {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      await this.connect()
    }

    try {
      await this.hubConnection!.invoke('JoinRoom', roomId.trim())
    } catch (error) {
      console.error('SignalR join room error', error)
      this.emit('Error', (error as Error).message)
    }
  }

  private async getAccessToken() {
    const accessToken = await SecureStore.getItemAsync(this.authKey)
    if (!accessToken) {
      throw new Error('Access token not found')
    }
    this.accessToken = JSON.parse(accessToken).accessToken
  }

  private async initListeners() {
    if (!this.hubConnection) return

    // Receive new message
    this.hubConnection.on('ReceiveMessage', (message: any) => {
      this.emit('ReceiveMessage', message)
    })

    this.hubConnection.on('MessageSent', (messageId: any, timestamp: string) => {
      this.emit('MessageSent', messageId, new Date(timestamp))
    })

    this.hubConnection.on('UserOnline', (userId: string, userName?: string) => {
      this.emit('UserOnline', userId, userName)
    })

    this.hubConnection.on('UserOffline', (userId: string, userName?: string) => {
      this.emit('UserOffline', userId, userName)
    })

    this.hubConnection.on('OnlineUsersList', (users: any[]) => {
      this.emit('OnlineUsersList', users)
    })

    this.hubConnection.on('JoinedRoom', (roomId: string) => {
      console.log('🏠 Đã join room thành công:', roomId)
      this.emit('JoinedRoom', roomId)
    })

    this.hubConnection.on('Error', (errorMessage: string) => {
      this.emit('Error', errorMessage)
    })

    console.log('Listeners initialized')
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: (...args: unknown[]) => void) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, ...args: unknown[]) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(...args))
    }
  }
}

const signalRService = new SignalRService()
export default signalRService
