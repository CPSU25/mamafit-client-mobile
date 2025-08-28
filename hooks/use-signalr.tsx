import NetInfo, { NetInfoState } from '@react-native-community/netinfo'
import { useQueryClient } from '@tanstack/react-query'
import { useSegments } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { toast } from 'sonner-native'
import MessageToast from '~/components/toast/message-toast'
import NotificationToast from '~/components/toast/notification-toast'
import { formatRealtimeMessageType, formatRealTimeNotificationType } from '~/lib/utils'
import chatHubService, { ChatHubEvents } from '~/services/signalr/chat-hub.service'
import notificationHubService, { NotificationHubEvents } from '~/services/signalr/notification-hub.service'
import { ChatRoom, Message, MessageTypeDB, MessageTypeRealTime } from '~/types/chat.type'
import { Notification, NotificationTypeDB, NotificationTypeRealTime } from '~/types/notification.type'
import { useAuth } from './use-auth'

export const useSignalR = () => {
  const { isAuthenticated, user } = useAuth()

  const queryClient = useQueryClient()
  const segments = useSegments()

  const isAttemptedReconnectChatHub = useRef(false)
  const isAttemptedReconnectNotificationHub = useRef(false)

  const currentMessages = useRef(new Set<string>())
  const currentNotifications = useRef(new Set<string>())

  const appState = useRef(AppState.currentState)

  // Function to display incoming messages from other users across the app
  const displayMessage = useCallback(
    (message: Message<MessageTypeRealTime>) => {
      const messageId = `${message.id}-${message.messageTimestamp}`

      if (currentMessages.current.has(messageId)) return

      currentMessages.current.add(messageId)

      if (currentMessages.current.size > 1000) {
        const recentMessages = Array.from(currentMessages.current).slice(-1000)
        currentMessages.current = new Set(recentMessages)
      }

      const { id, chatRoomId, messageTimestamp, senderAvatar, senderId, senderName, type, isRead } = message

      const isNotMe = senderId !== user?.userId

      const newMessage: Message<MessageTypeDB> = {
        id,
        senderAvatar,
        senderName,
        message: message.message,
        senderId,
        chatRoomId,
        type: formatRealtimeMessageType(type),
        messageTimestamp,
        isRead
      }

      console.log('ChatHub', newMessage)

      if (isNotMe) {
        // Update rooms list
        queryClient.setQueryData(['rooms', user?.userId], (oldData: ChatRoom[] | undefined) => {
          if (!oldData) return oldData

          const newRooms: ChatRoom[] = oldData.map((room) => {
            if (room.id === chatRoomId) {
              const newRoom: Partial<ChatRoom> = {
                lastMessage: message.message,
                lastTimestamp: messageTimestamp,
                lastUserId: senderId,
                lastUserName: senderName
              }
              return { ...room, ...newRoom }
            }
            return room
          })

          return newRooms
        })

        // Update room messages for infinite query
        queryClient.setQueryData(
          ['room-messages', chatRoomId, user?.userId],
          (oldData: { pages: Message<MessageTypeDB>[][]; pageParams: number[] } | undefined) => {
            if (!oldData) return oldData

            // Add new message to the END of the first page (newest messages page)
            // Since pages are reversed in the component, first page contains newest messages
            const updatedPages = [...oldData.pages]
            if (updatedPages.length > 0) {
              // Add to the end of the first page since it contains the newest messages
              updatedPages[0] = [...updatedPages[0], newMessage]
            } else {
              // If no pages exist, create first page with the new message
              updatedPages.push([newMessage])
            }

            return {
              ...oldData,
              pages: updatedPages
            }
          }
        )

        const isOnChatScreen = segments.length > 0 && segments.some((segment) => segment === 'chat')

        if (!isOnChatScreen) {
          toast.custom(<MessageToast message={newMessage} />)
        }
      }
    },
    [user?.userId, queryClient, segments]
  )

  // Function to display incoming notifications from other users across the app
  const displayNotification = useCallback(
    (notification: Notification<NotificationTypeRealTime>) => {
      const notificationId = `${notification.id}-${notification.createdAt}`

      if (currentNotifications.current.has(notificationId)) return

      currentNotifications.current.add(notificationId)

      if (currentNotifications.current.size > 1000) {
        const recentMessages = Array.from(currentNotifications.current).slice(-1000)
        currentNotifications.current = new Set(recentMessages)
      }

      console.log('NotificationHub', notification)

      queryClient.invalidateQueries({ queryKey: ['notifications'] })

      if (notification.type === NotificationTypeRealTime.PAYMENT) {
        queryClient.setQueryData(
          ['payment-status', notification.metadata?.orderId, user?.userId],
          (oldData: string | undefined) => {
            if (!oldData) return oldData
            return notification.metadata?.paymentStatus
          }
        )
      }

      if (
        notification.type === NotificationTypeRealTime.ORDER_PROGRESS ||
        notification.type === NotificationTypeRealTime.PAYMENT
      ) {
        queryClient.invalidateQueries({ queryKey: ['order'] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['orders-count'] })
        queryClient.invalidateQueries({ queryKey: ['order-items-milestones'] })
        queryClient.invalidateQueries({ queryKey: ['designer-info'] })
      }

      const newNotification: Notification<NotificationTypeDB> = {
        ...notification,
        type: formatRealTimeNotificationType(notification.type)
      }

      toast.custom(<NotificationToast notification={newNotification} />)
    },
    [user?.userId, queryClient]
  )

  // Listen for new messages/notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const messageHandler = (...args: unknown[]) => {
        try {
          const message = args[0] as Message<MessageTypeRealTime>
          if (message) {
            displayMessage(message)
          }
        } catch (error) {
          console.error('Error handling SignalR message:', error)
        }
      }

      const notificationHandler = (...args: unknown[]) => {
        try {
          const notification = args[0] as Notification<NotificationTypeRealTime>
          if (notification) {
            displayNotification(notification)
          }
        } catch (error) {
          console.error('Error handling SignalR notification:', error)
        }
      }

      const invitedToRoomHandler = () => {
        try {
          queryClient.invalidateQueries({ queryKey: ['rooms'] })
        } catch (error) {
          console.error('Error handling SignalR invite to room:', error)
        }
      }

      chatHubService.on(ChatHubEvents.ReceiveMessage, messageHandler)
      chatHubService.on(ChatHubEvents.InvitedToRoom, invitedToRoomHandler)
      notificationHubService.on(NotificationHubEvents.ReceiveNotification, notificationHandler)

      return () => {
        chatHubService.off(ChatHubEvents.ReceiveMessage, messageHandler)
        notificationHubService.off(NotificationHubEvents.ReceiveNotification, notificationHandler)
      }
    }
  }, [isAuthenticated, displayMessage, displayNotification, queryClient, user?.userId])

  // Handle connection based on authentication state
  useEffect(() => {
    if (isAuthenticated) {
      if (!isAttemptedReconnectChatHub.current && !chatHubService.isConnected) {
        isAttemptedReconnectChatHub.current = true
        chatHubService.connect()
      }

      if (!isAttemptedReconnectNotificationHub.current && !notificationHubService.isConnected) {
        isAttemptedReconnectNotificationHub.current = true
        notificationHubService.connect()
      }
    } else {
      if (chatHubService.isConnected) {
        chatHubService.destroy()
        isAttemptedReconnectChatHub.current = false
        currentMessages.current.clear()
      }

      if (notificationHubService.isConnected) {
        notificationHubService.destroy()
        isAttemptedReconnectNotificationHub.current = false
        currentNotifications.current.clear()
      }
    }
  }, [isAuthenticated])

  // Handle app state changes (foreground/background)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && appState.current !== 'active' && isAuthenticated) {
        if (!chatHubService.isConnected) {
          chatHubService.connect()
        }
        if (!notificationHubService.isConnected) {
          notificationHubService.connect()
        }
      }
      appState.current = nextAppState
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription?.remove()
    }
  }, [isAuthenticated])

  // Handle network changes
  useEffect(() => {
    const handleNetworkChange = (state: NetInfoState) => {
      if (state.isConnected && isAuthenticated) {
        if (!chatHubService.isConnected) {
          chatHubService.connect()
        }
        if (!notificationHubService.isConnected) {
          notificationHubService.connect()
        }
      }
    }

    const unsubscribe = NetInfo.addEventListener(handleNetworkChange)

    return () => {
      unsubscribe()
    }
  }, [isAuthenticated])

  // Handle connection errors
  useEffect(() => {
    const handleMessageError = (...args: unknown[]) => {
      const error = args[0] as string

      if (error.includes('Maximum reconnection attempts')) {
        toast.error('Connection Failed', {
          description: 'Unable to reconnect. Please try again later.',
          action: { label: 'Retry', onClick: () => chatHubService.connect() }
        })
      } else if (error.includes('Unauthorized') || error.includes('401')) {
        // Token refresh is now handled centrally by axios interceptors
        console.log('Authentication error detected, token refresh will be handled automatically')
      } else {
        toast.error('Connection Error', { description: 'Attempting to reconnect...' })
      }
    }

    const handleNotificationError = (...args: unknown[]) => {
      const error = args[0] as string

      if (error.includes('Maximum reconnection attempts')) {
        toast.error('Notification Connection Failed', {
          description: 'Unable to reconnect notifications. Please try again later.',
          action: { label: 'Retry', onClick: () => notificationHubService.connect() }
        })
      } else if (error.includes('Unauthorized') || error.includes('401')) {
        // Token refresh is now handled centrally by axios interceptors
        console.log('Notification authentication error detected, token refresh will be handled automatically')
      } else {
        toast.error('Notification Connection Error', { description: 'Attempting to reconnect...' })
      }
    }

    chatHubService.on(ChatHubEvents.Error, handleMessageError)
    notificationHubService.on(NotificationHubEvents.Error, handleNotificationError)

    return () => {
      chatHubService.off(ChatHubEvents.Error, handleMessageError)
      notificationHubService.off(NotificationHubEvents.Error, handleNotificationError)
    }
  }, [])
}
