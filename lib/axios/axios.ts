import axios, { AxiosError, InternalAxiosRequestConfig, isAxiosError } from 'axios'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as Updates from 'expo-updates'
import { BaseResponse, RefreshResponse } from '~/types/common'
import { clear, setTokens } from '../redux-toolkit/slices/auth.slice'
import { store } from '../redux-toolkit/store'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL
if (!baseURL) throw new Error('EXPO_PUBLIC_API_BASE_URL is not defined')

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const getAuthTokens = async (): Promise<AuthTokens | null> => {
  try {
    const authData = await SecureStore.getItemAsync('auth-storage')
    return authData ? JSON.parse(authData) : null
  } catch (error) {
    console.error('Error getting auth tokens:', error)
    return null
  }
}

const saveAuthTokens = async (tokens: AuthTokens): Promise<void> => {
  if (!tokens.accessToken || !tokens.refreshToken) {
    throw new Error('Invalid tokens provided')
  }
  try {
    await SecureStore.setItemAsync('auth-storage', JSON.stringify(tokens))
    store.dispatch(setTokens(tokens))
  } catch (error) {
    console.error('Error saving auth tokens:', error)
    throw error
  }
}

const clearAuthTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('auth-storage')
    store.dispatch(clear())
    router.replace('/profile')
  } catch (error) {
    console.error('Error clearing auth tokens:', error)
    throw error
  }
}

let refreshPromise: Promise<AuthTokens | undefined> | null = null

const refresh = async (): Promise<AuthTokens | undefined> => {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const authData = await getAuthTokens()
      const currentRefreshToken = authData?.refreshToken

      if (!currentRefreshToken) {
        throw new Error('No refresh token available')
      }

      console.log('Refreshing token...', currentRefreshToken)

      const { data } = await axios.post<BaseResponse<RefreshResponse>>(
        `${baseURL}auth/refresh-token`,
        { refreshToken: currentRefreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (!data.data?.accessToken || !data.data?.refreshToken) {
        throw new Error('Invalid refresh response')
      }

      await saveAuthTokens({ accessToken: data.data?.accessToken, refreshToken: data.data?.refreshToken })
      return data.data
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        await clearAuthTokens()
        await Updates.reloadAsync()
      }
      console.log('error', JSON.stringify(error, null, 2))
    } finally {
      refreshPromise = null
    }
  })()
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authData = await getAuthTokens()
    if (authData?.accessToken && config.url !== '/auth/refresh-token') {
      config.headers.Authorization = `Bearer ${authData.accessToken}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

const shouldIntercept = (error: AxiosError): boolean => {
  return error.response?.status === 403 && (error.response?.data as any)?.message === 'Token is expired'
}

const setTokenData = async (tokenData: AuthTokens, axiosClient: typeof api): Promise<void> => {
  await saveAuthTokens(tokenData)
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${tokenData.accessToken}`
}

const handleTokenRefresh = async (): Promise<AuthTokens | undefined> => {
  try {
    return await refresh()
  } catch (error) {
    console.error('Token refresh failed:', error)
    throw error
  }
}

const attachTokenToRequest = (request: InternalAxiosRequestConfig, token: string) => {
  request.headers.Authorization = `Bearer ${token}`
}

export const applyAppTokenRefreshInterceptor = (axiosClient: typeof api, customOptions = {}) => {
  let isRefreshing = false
  let failedQueue: { resolve: (token: string) => void; reject: (error: AxiosError) => void }[] = []

  const options = {
    attachTokenToRequest,
    handleTokenRefresh,
    setTokenData,
    shouldIntercept,
    ...customOptions
  }

  const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      error ? prom.reject(error) : prom.resolve(token!)
    })
    failedQueue = []
  }

  const interceptor = async (error: AxiosError) => {
    if (!options.shouldIntercept(error)) return Promise.reject(error)

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
      _queued?: boolean
    }

    if (originalRequest._retry || originalRequest._queued) return Promise.reject(error)

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newAccessToken: string) => {
            originalRequest._queued = true
            options.attachTokenToRequest(originalRequest, newAccessToken)
            resolve(axiosClient(originalRequest))
          },
          reject: (err: AxiosError) => reject(err)
        })
      })
    }

    isRefreshing = true
    return new Promise((resolve, reject) => {
      options
        .handleTokenRefresh()
        .then((tokenData: AuthTokens | undefined) => {
          if (!tokenData) return reject(error)
          options.setTokenData(tokenData, axiosClient)
          options.attachTokenToRequest(originalRequest, tokenData.accessToken)
          processQueue(null, tokenData.accessToken)
          resolve(axiosClient(originalRequest))
        })
        .catch((err: AxiosError) => {
          processQueue(err, null)
          reject(err)
        })
        .finally(() => {
          isRefreshing = false
        })
    })
  }

  axiosClient.interceptors.response.use(undefined, interceptor)
}

// Apply the modular interceptor to the api instance
applyAppTokenRefreshInterceptor(api)
