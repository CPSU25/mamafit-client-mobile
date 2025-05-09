import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

const handleRegistrationError = (errorMessage: string) => {
  alert(errorMessage)
  throw new Error(errorMessage)
}

export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    // Set the notification channel for Android with the highest priority
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  // Check if the app is running on a physical device
  if (Device.isDevice) {
    // Get the current status of the notification permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    // If the permission is not granted, request it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    // If the permission is not granted twice, throw an error
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!')
      return
    }

    // Get the project ID in EAS
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
    if (!projectId) {
      handleRegistrationError('Project ID not found')
    }

    // Get the push token
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId
        })
      ).data
      console.log(pushTokenString)
      return pushTokenString
    } catch (e: unknown) {
      handleRegistrationError(`${e}`)
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications')
  }
}
