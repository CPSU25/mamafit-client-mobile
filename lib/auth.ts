import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { isAxiosError } from 'axios'
import * as Updates from 'expo-updates'
import tokenEventService from '~/services/signalr/token-event.service'
import { AuthTokens } from '~/types/common'
import { clearAuthTokens, getAuthTokens, saveAuthTokens } from './utils'

// Singleton promise to prevent multiple simultaneous refresh attempts
let refreshPromise: Promise<AuthTokens> | null = null

export const refreshAuthTokens = async (): Promise<AuthTokens> => {
  // If a refresh is already in progress, return the existing promise
  if (refreshPromise) return refreshPromise

  // Assign the refresh operation to the singleton promise
  refreshPromise = (async () => {
    try {
      const authData = await getAuthTokens()
      const currentRefreshToken = authData?.refreshToken

      if (!currentRefreshToken) {
        throw new Error('No refresh token available')
      }

      console.log('Refreshing token...', currentRefreshToken)

      const { data } = await axios.post<{ data: { accessToken: string; refreshToken: string } }>(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/refresh-token`,
        { refreshToken: currentRefreshToken }
      )

      if (!data.data?.accessToken || !data.data?.refreshToken) {
        throw new Error('Invalid refresh response')
      }

      const newTokens: AuthTokens = {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken
      }

      // Persist new tokens to storage + redux state
      await saveAuthTokens(newTokens)

      // Notify SignalR services to update their access tokens
      tokenEventService.emit('TokenRefreshed', newTokens)

      return newTokens
    } catch (error) {
      console.error('Token refresh failed:', error)

      if (isAxiosError(error) && error.response?.status === 401) {
        await clearAuthTokens()
        tokenEventService.emit('AuthFailed')
        await AsyncStorage.clear()
        await Updates.reloadAsync()
      }

      throw error
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}
