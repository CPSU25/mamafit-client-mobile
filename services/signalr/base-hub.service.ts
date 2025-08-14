import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr'
import { getAuthTokens } from '~/lib/utils'
import tokenEventService from './token-event.service'

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

export enum HubEvents {
  Error = 'Error',
  TokenRefreshed = 'TokenRefreshed',
  AuthFailed = 'AuthFailed'
}

type ListenerCallback = (...args: unknown[]) => void

export abstract class BaseHubService {
  protected hubConnection: HubConnection | null = null
  protected accessToken = ''
  protected listeners = new Map<string, ListenerCallback[]>()
  protected reconnectAttempts = 0
  protected maxReconnectAttempts = 5
  protected connectionState: ConnectionState = 'disconnected'
  protected abstract endpoint: string

  private tokenRefreshedHandler: (newTokens: any) => Promise<void>
  private authFailedHandler: () => Promise<void>
  private reconnectTimeoutId: any = null

  constructor() {
    // Bind handlers for event service so we can remove them later
    this.tokenRefreshedHandler = async (newTokens) => {
      this.accessToken = newTokens.accessToken
      if (this.isConnected) {
        await this.disconnect()
        await this.connect()
      }
    }
    this.authFailedHandler = async () => {
      this.destroy()
    }
    // Get access token from auth module
    this.initializeAccessToken()
    // Setup token event listeners
    this.setupTokenEventListeners()
  }

  private async initializeAccessToken() {
    await this.getAccessToken()
  }

  // Register and cleanup token event listeners
  private setupTokenEventListeners() {
    tokenEventService.on(HubEvents.TokenRefreshed, this.tokenRefreshedHandler)
    tokenEventService.on(HubEvents.AuthFailed, this.authFailedHandler)
  }

  private cleanupTokenEventListeners() {
    tokenEventService.off(HubEvents.TokenRefreshed, this.tokenRefreshedHandler)
    tokenEventService.off(HubEvents.AuthFailed, this.authFailedHandler)
  }

  // Getters
  get isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected
  }

  get currentConnectionState(): ConnectionState {
    return this.connectionState
  }

  get getReconnectAttempts(): number {
    return this.reconnectAttempts
  }

  // Initialize SignalR connection
  protected async init(): Promise<HubConnection> {
    const wsUrl = process.env.EXPO_PUBLIC_API_WS_URL
    if (!wsUrl) throw new Error('EXPO_PUBLIC_API_WS_URL is not set')

    const connection = new HubConnectionBuilder()
      .withUrl(`${wsUrl}/${this.endpoint}`, {
        accessTokenFactory: () => this.getAccessToken().then(() => this.accessToken),
        transport: HttpTransportType.WebSockets,
        skipNegotiation: false,
        withCredentials: false
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) =>
          retryContext.previousRetryCount < this.maxReconnectAttempts
            ? Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000)
            : null
      })
      .configureLogging(LogLevel.Information)
      .build()

    // Handle built-in connection lifecycle events
    connection.onreconnecting(() => {
      this.connectionState = 'reconnecting'
      console.log(`${this.endpoint} reconnecting...`)
    })

    connection.onreconnected(() => {
      this.connectionState = 'connected'
      this.reconnectAttempts = 0
      console.log(`${this.endpoint} reconnected`)
    })

    connection.onclose((error) => {
      this.connectionState = 'disconnected'
      if (error) {
        console.error(`${this.endpoint} closed with error:`, error)
        this.emit(HubEvents.Error, error.message)
      } else {
        console.log(`${this.endpoint} connection closed`)
      }
    })

    return connection
  }

  // Sub-classes should override this method to register custom event listeners
  protected abstract initListeners(): void

  // Connect to the SignalR hub
  async connect() {
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
      console.log(`${this.endpoint} connected`)
    } catch (error) {
      this.handleConnectionError(error as Error)
    }
  }

  // Disconnect from the SignalR hub
  async disconnect() {
    this.connectionState = 'disconnected'
    this.reconnectAttempts = 0
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId)
      this.reconnectTimeoutId = null
    }

    if (this.hubConnection) {
      // Remove all event handlers for safety (subclasses should override and remove their custom handlers)
      this.removeAllHubListeners()
      try {
        await this.hubConnection.stop()
        console.log(`${this.endpoint} disconnected`)
      } catch (err) {
        console.error(`${this.endpoint} failed to disconnect:`, err)
      }
    }
  }

  // Sub-classes should override this method to remove their custom event listeners
  protected removeAllHubListeners() {}

  // Handle connection errors + reconnect attempts
  private handleConnectionError(error: Error) {
    this.connectionState = 'disconnected'
    this.emit(HubEvents.Error, error.message)
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      this.reconnectTimeoutId = setTimeout(() => this.connect(), delay)
    } else {
      this.emit(HubEvents.Error, 'Maximum reconnection attempts reached')
    }
  }

  // Ensures that we are connected before proceeding
  protected async ensureConnected() {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      await this.connect()
    }
  }

  // Retrieve access token
  protected async getAccessToken() {
    const authTokens = await getAuthTokens()
    if (authTokens?.accessToken) {
      this.accessToken = authTokens.accessToken
    }
  }

  // Register a listener for a custom event (from the hub)
  on(event: string, callback: ListenerCallback) {
    if (!this.listeners.has(event)) this.listeners.set(event, [])
    this.listeners.get(event)!.push(callback)
  }

  // Remove a listener for a custom event
  off(event: string, callback: ListenerCallback) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) eventListeners.splice(index, 1)
    }
  }

  // Emit an event to all registered listeners
  protected emit(event: string, ...args: unknown[]) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) eventListeners.forEach((callback) => callback(...args))
  }

  // Destroy this service (remove token event listeners, disconnect, clear listeners - sub-classes will call this to cleanup)
  destroy() {
    this.cleanupTokenEventListeners()
    this.disconnect()
    this.listeners.clear()
  }
}
