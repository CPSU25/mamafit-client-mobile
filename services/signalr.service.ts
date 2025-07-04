import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr'
import axios, { isAxiosError } from 'axios'
import * as SecureStore from 'expo-secure-store'
import * as Updates from 'expo-updates'
import { clearAuthTokens, getAuthTokens, saveAuthTokens } from '~/lib/utils'
import { BaseResponse, RefreshResponse } from '~/types/common'

interface MessagePayload {
  ChatRoomId: string
  Message: string
  Type: number
}

interface ListenerCallback {
  (...args: unknown[]): void
}

class SignalRService {
  private hubConnection: HubConnection | null = null
  private accessToken = ''
  private listeners = new Map<string, ListenerCallback[]>()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private connectionState: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' = 'disconnected'

  private readonly wsUrl = process.env.EXPO_PUBLIC_API_WS_URL
  private readonly chatEndpoint = 'chatHub'
  private readonly authKey = 'auth-storage'

  constructor() {
    this.initializeAccessToken()
  }

  private async initializeAccessToken() {
    await this.getAccessToken()
  }

  // Build and configure SignalR connection
  private async init(): Promise<HubConnection> {
    if (!this.wsUrl) throw new Error('EXPO_PUBLIC_API_WS_URL is not set')

    const connection = new HubConnectionBuilder()
      .withUrl(`${this.wsUrl}/${this.chatEndpoint}`, {
        accessTokenFactory: () => this.getAccessToken().then(() => this.accessToken),
        transport: HttpTransportType.WebSockets,
        skipNegotiation: false,
        withCredentials: false
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          return retryContext.previousRetryCount < this.maxReconnectAttempts
            ? Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000)
            : null
        }
      })
      .configureLogging(LogLevel.Information)
      .build()

    // Set up connection state handlers
    connection.onreconnecting(() => {
      this.connectionState = 'reconnecting'
      console.log('SignalR reconnecting...')
    })

    connection.onreconnected(() => {
      this.connectionState = 'connected'
      this.reconnectAttempts = 0
      console.log('SignalR reconnected')
    })

    connection.onclose((error) => {
      this.connectionState = 'disconnected'
      if (error) {
        console.error('SignalR closed with error:', error)
        this.emit('Error', error.message)
      } else {
        console.log('SignalR connection closed')
      }
    })

    return connection
  }

  // Public getters for connection status
  get isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected
  }

  get currentConnectionState() {
    return this.connectionState
  }

  get getReconnectAttempts(): number {
    return this.reconnectAttempts
  }

  // Fetch and store access token from secure storage
  private async getAccessToken(): Promise<void> {
    const storedToken = await SecureStore.getItemAsync(this.authKey)
    if (!storedToken) return

    this.accessToken = JSON.parse(storedToken).accessToken
  }

  // Refresh authentication tokens and reconnect if needed
  async refresh(): Promise<void> {
    try {
      const authData = await getAuthTokens()
      if (!authData?.refreshToken) throw new Error('No refresh token available')

      const { data } = await axios.post<BaseResponse<RefreshResponse>>(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}auth/refresh-token`,
        { refreshToken: authData.refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (!data.data?.accessToken || !data.data?.refreshToken) {
        throw new Error('Invalid refresh response')
      }

      await saveAuthTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken })
      this.accessToken = data.data.accessToken

      if (this.isConnected) {
        await this.disconnect()
        await this.connect()
      }
    } catch (error) {
      this.emit('Error', (error as Error).message)
      await this.disconnect()
      if (isAxiosError(error) && error.response?.status === 401) {
        await clearAuthTokens()
        await Updates.reloadAsync()
      }
    }
  }

  // Establish SignalR connection
  async connect(): Promise<void> {
    if (this.connectionState === 'connecting' || this.connectionState === 'reconnecting') return

    this.connectionState = 'connecting'
    if (!this.hubConnection) {
      this.hubConnection = await this.init()
      this.initListeners()
    }

    try {
      await this.hubConnection.start()
      this.connectionState = 'connected'
      this.reconnectAttempts = 0
      console.log('SignalR connected')
    } catch (error) {
      this.handleConnectionError(error as Error)
    }
  }

  // Handle connection errors with retry logic
  private handleConnectionError(error: Error): void {
    this.connectionState = 'disconnected'
    this.emit('Error', error.message)

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      setTimeout(() => this.connect(), delay)
    } else {
      this.emit('Error', 'Maximum reconnection attempts reached')
    }
  }

  // Disconnect from SignalR hub
  async disconnect(): Promise<void> {
    this.connectionState = 'disconnected'
    this.reconnectAttempts = 0
    if (this.hubConnection) {
      await this.hubConnection.stop()
      console.log('SignalR disconnected')
    }
  }

  // Ensure connection before invoking hub methods
  private async ensureConnected(): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      await this.connect()
    }
  }

  // Send a chat message
  async sendMessage(roomId: string, message: string, type: number): Promise<void> {
    await this.ensureConnected()
    try {
      const payload: MessagePayload = { ChatRoomId: roomId, Message: message, Type: type }
      await this.hubConnection!.invoke('SendMessage', payload)
    } catch (error) {
      console.error('SignalR send error:', error)
      this.emit('Error', (error as Error).message)
    }
  }

  // Join a chat room
  // async joinRoom(roomId: string): Promise<void> {
  //   await this.ensureConnected()
  //   try {
  //     await this.hubConnection!.invoke('JoinRoom', roomId.trim())
  //   } catch (error) {
  //     console.error('SignalR join room error:', error)
  //     this.emit('Error', (error as Error).message)
  //   }
  // }

  // Initialize all SignalR event listeners
  private initListeners(): void {
    if (!this.hubConnection) return

    this.hubConnection.on('ReceiveMessage', (message) => this.emit('ReceiveMessage', message))
    this.hubConnection.on('UserOnline', (userId, userName) => this.emit('UserOnline', userId, userName))
    this.hubConnection.on('UserOffline', (userId, userName) => this.emit('UserOffline', userId, userName))
    this.hubConnection.on('OnlineUsersList', (users) => this.emit('OnlineUsersList', users))
    this.hubConnection.on('JoinedRoom', (roomId) => this.emit('JoinedRoom', roomId))
    this.hubConnection.on('Error', (errorMessage) => this.emit('Error', errorMessage))

    console.log('Listeners initialized')
  }

  // Event listener management
  on(event: string, callback: ListenerCallback): void {
    if (!this.listeners.has(event)) this.listeners.set(event, [])
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: ListenerCallback): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) eventListeners.splice(index, 1)
    }
  }

  private emit(event: string, ...args: unknown[]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) eventListeners.forEach((callback) => callback(...args))
  }
}

const signalRService = new SignalRService()
export default signalRService
