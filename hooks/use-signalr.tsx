import NetInfo, { NetInfoState } from '@react-native-community/netinfo'
import { useQueryClient } from '@tanstack/react-query'
import { useSegments } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { toast } from 'sonner-native'
import MessageToast from '~/components/toast/message-toast'
import NotificationToast from '~/components/toast/notification-toast'
import chatHubService, { ChatHubEvents } from '~/services/signalr/chat-hub.service'
import notificationHubService, { NotificationHubEvents } from '~/services/signalr/notification-hub.service'
import { ChatRoom, Message } from '~/types/chat.type'
import { Notification } from '~/types/notification.type'
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
    (message: Message) => {
      const messageId = `${message.id}-${message.messageTimestamp}`

      if (currentMessages.current.has(messageId)) return

      currentMessages.current.add(messageId)

      if (currentMessages.current.size > 1000) {
        const recentMessages = Array.from(currentMessages.current).slice(-1000)
        currentMessages.current = new Set(recentMessages)
      }

      const { id, chatRoomId, messageTimestamp, senderAvatar, senderId, senderName, type, isRead } = message

      const isNotMe = senderId !== user?.userId

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

        // Update room messages
        queryClient.setQueryData(['room-messages', chatRoomId, user?.userId], (oldData: Message[] | undefined) => {
          if (!oldData) return oldData

          const newMessage: Message = {
            id,
            senderAvatar,
            senderName,
            message: message.message,
            senderId,
            chatRoomId,
            type,
            messageTimestamp,
            isRead
          }

          return [...oldData, newMessage]
        })

        const isOnChatScreen = segments.length > 0 && segments.some((segment) => segment === 'chat')

        if (!isOnChatScreen) {
          toast.custom(<MessageToast message={message} />)
        }
      }
    },
    [user?.userId, queryClient, segments]
  )

  // Function to display incoming notifications from other users across the app
  const displayNotification = useCallback(
    (notification: Notification) => {
      const notificationId = `${notification.id}-${notification.createdAt}`

      if (currentNotifications.current.has(notificationId)) return

      currentNotifications.current.add(notificationId)

      if (currentNotifications.current.size > 1000) {
        const recentMessages = Array.from(currentNotifications.current).slice(-1000)
        currentNotifications.current = new Set(recentMessages)
      }

      // const {
      //   id,
      //   createdAt,
      //   createdBy,
      //   isRead,
      //   metadata,
      //   notificationContent,
      //   notificationTitle,
      //   receiverId,
      //   type,
      //   updatedAt,
      //   updatedBy
      // } = notification

      const isOnNotificationScreen = segments.length > 0 && segments.some((segment) => segment === 'notifications')

      if (!isOnNotificationScreen) {
        // TODO: Add notification to the query cache
        toast.custom(<NotificationToast notification={notification} />)
      }
    },
    [segments]
  )

  // Listen for new messages/notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const messageHandler = (...args: unknown[]) => {
        try {
          const message = args[0] as Message
          if (message) {
            displayMessage(message)
          }
        } catch (error) {
          console.error('Error handling SignalR message:', error)
        }
      }

      const notificationHandler = (...args: unknown[]) => {
        try {
          const notification = args[0] as Notification
          if (notification) {
            displayNotification(notification)
          }
        } catch (error) {
          console.error('Error handling SignalR notification:', error)
        }
      }

      chatHubService.on(ChatHubEvents.ReceiveMessage, messageHandler)
      notificationHubService.on(NotificationHubEvents.ReceiveNotification, notificationHandler)

      return () => {
        chatHubService.off(ChatHubEvents.ReceiveMessage, messageHandler)
        notificationHubService.off(NotificationHubEvents.ReceiveNotification, notificationHandler)
      }
    }
  }, [isAuthenticated, displayMessage, displayNotification])

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
