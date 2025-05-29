import * as SecureStore from 'expo-secure-store'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { clearTokens, setTokens } from '../redux-toolkit/slices/auth.slice'
import { store } from '../redux-toolkit/store'

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL

if (!baseURL) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL is not defined')
}

let isRefreshing = false
let failedRequestsQueue: {
  resolve: (token: string) => void
  reject: (error: AxiosError) => void
}[] = []

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const getAuthTokens = async () => {
  try {
    const authData = await SecureStore.getItemAsync('auth-storage')
    return authData ? JSON.parse(authData) : null
  } catch (error) {
    console.error('Error reading auth tokens:', error)
    return null
  }
}

const saveAuthTokens = async (tokens: { accessToken: string; refreshToken: string }) => {
  try {
    await SecureStore.setItemAsync('auth-storage', JSON.stringify(tokens))
    store.dispatch(setTokens(tokens))
  } catch (error) {
    console.error('Error saving auth tokens:', error)
  }
}

const clearAuthTokens = async () => {
  try {
    await SecureStore.deleteItemAsync('auth-storage')
    store.dispatch(clearTokens())
  } catch (error) {
    console.error('Error clearing auth tokens:', error)
  }
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authData = await getAuthTokens()
    if (authData?.accessToken && config.url !== '/auth/refresh-token' && config.headers) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`
    }
    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (
      error.response?.status === 403 &&
      !originalRequest?._retry &&
      (error.response?.data as any)?.message === 'jwt expired' &&
      originalRequest.url !== '/auth/refresh'
    ) {
      if (!originalRequest?._retry) originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true

        try {
          const { accessToken } = await refresh()
          isRefreshing = false

          failedRequestsQueue.forEach(({ resolve }) => resolve(accessToken))
          failedRequestsQueue = []

          return api(originalRequest)
        } catch (refreshError) {
          failedRequestsQueue.forEach(({ reject }) => reject(refreshError as AxiosError))
          failedRequestsQueue = []
          await clearAuthTokens()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          resolve: (newAccessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            resolve(api(originalRequest))
          },
          reject: (error: AxiosError) => {
            reject(error)
          }
        })
      })
    }

    return Promise.reject(error)
  }
)

const refresh = async () => {
  const authData = await getAuthTokens()
  const currentRefreshToken = authData?.refreshToken

  if (!currentRefreshToken) {
    throw new Error('No refresh token available')
  }

  try {
    const { data } = await api.post<{
      accessToken: string
      refreshToken: string
    }>('/auth/refresh', { refreshToken: currentRefreshToken })

    if (data.accessToken && data.refreshToken) {
      await saveAuthTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      })
      return data
    }

    return { accessToken: '', refreshToken: '' }
  } catch (error) {
    console.error('Refresh token error:', error)
    throw error
  }
}
