import NetInfo, { NetInfoState } from '@react-native-community/netinfo'
import { useQueryClient } from '@tanstack/react-query'
import { useSegments } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { toast } from 'sonner-native'
import MessageToast from '~/components/toast/message-toast'
import signalRService from '~/services/signalr.service'
import { ChatRoom, Message } from '~/types/chat.type'
import { useAuth } from './use-auth'

export const useSignalR = () => {
  const { isAuthenticated, user } = useAuth()

  const queryClient = useQueryClient()
  const segments = useSegments()

  const isAttemptedReconnect = useRef(false)
  const currentMessages = useRef(new Set<string>())
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

  // Listen for new messages when authenticated
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

      signalRService.on('ReceiveMessage', messageHandler)

      return () => {
        signalRService.off('ReceiveMessage', messageHandler)
      }
    }
  }, [isAuthenticated, displayMessage])

  // Handle connection based on authentication state
  useEffect(() => {
    if (isAuthenticated) {
      if (!isAttemptedReconnect.current && !signalRService.isConnected) {
        isAttemptedReconnect.current = true
        signalRService.connect()
      }
    } else {
      if (signalRService.isConnected) {
        signalRService.disconnect()
        isAttemptedReconnect.current = false
        currentMessages.current.clear()
      }
    }
  }, [isAuthenticated])

  // Handle app state changes (foreground/background)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && appState.current !== 'active' && isAuthenticated) {
        // App came to foreground - reconnect if needed
        if (!signalRService.isConnected) {
          signalRService.connect()
        }
      }
      appState.current = nextAppState
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription?.remove()
    }
  }, [isAuthenticated])

  useEffect(() => {
    const handleNetworkChange = (state: NetInfoState) => {
      if (state.isConnected && isAuthenticated) {
        if (!signalRService.isConnected) {
          signalRService.connect()
        }
      }
    }

    const unsubscribe = NetInfo.addEventListener(handleNetworkChange)

    return () => {
      unsubscribe()
    }
  }, [isAuthenticated])

  useEffect(() => {
    const handleError = (...args: unknown[]) => {
      const error = args[0] as string

      if (error.includes('Maximum reconnection attempts')) {
        toast.error('Connection Failed', {
          description: 'Unable to reconnect. Please try again later.',
          action: { label: 'Retry', onClick: () => signalRService.connect() }
        })
      } else if (error.includes('Unauthorized')) {
        signalRService.refresh()
      } else {
        toast.error('Connection Error', { description: 'Attempting to reconnect...' })
      }
    }
    signalRService.on('Error', handleError)

    return () => signalRService.off('Error', handleError)
  }, [])
}
