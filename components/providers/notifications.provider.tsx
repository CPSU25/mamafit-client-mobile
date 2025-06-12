import * as Notifications from 'expo-notifications'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { registerForPushNotificationsAsync } from '~/lib/register-push-notifications'

interface NotificationContextType {
  expoPushToken: string | null
  notification: Notifications.Notification | null
  error: Error | null
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState<Notifications.Notification | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error: any) => setError(error))

    // If the app is opened, we can get the notification
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received while the app is running', notification)
      setNotification(notification)
    })

    // When user interact with the notification, we can get the response
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(
        'User interact with the notification',
        JSON.stringify(response, null, 2),
        JSON.stringify(response.notification.request.content.data, null, 2)
      )
      // Handle the notification response logic here
    })

    return () => {
      notificationListener.remove()
      responseListener.remove()
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  )
}
