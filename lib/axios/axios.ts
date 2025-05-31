import * as SecureStore from 'expo-secure-store'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { clearTokens, setTokens } from '../redux-toolkit/slices/auth.slice'
import { store } from '../redux-toolkit/store'

// Base URL from environment variable
const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL
if (!baseURL) throw new Error('EXPO_PUBLIC_API_BASE_URL is not defined')

// Create Axios instance
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Get auth tokens from SecureStore
const getAuthTokens = async () => {
  const authData = await SecureStore.getItemAsync('auth-storage')
  return authData ? JSON.parse(authData) : null
}

// Save auth tokens to SecureStore and Redux
const saveAuthTokens = async (tokens: { accessToken: string; refreshToken: string }) => {
  if (!tokens.accessToken || !tokens.refreshToken) throw new Error('Invalid tokens provided')
  await SecureStore.setItemAsync('auth-storage', JSON.stringify(tokens))
  store.dispatch(setTokens(tokens))
}

// Clear auth tokens from SecureStore and Redux
const clearAuthTokens = async () => {
  await SecureStore.deleteItemAsync('auth-storage')
  store.dispatch(clearTokens())
}

// Refresh token function
const refresh = async () => {
  const authData = await getAuthTokens()
  const currentRefreshToken = authData?.refreshToken
  if (!currentRefreshToken) throw new Error('No refresh token available')

  const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
    `${baseURL}/auth/refresh-token`,
    { refreshToken: currentRefreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  )

  if (!data.accessToken || !data.refreshToken) throw new Error('Invalid refresh response')
  await saveAuthTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  return data
}

// Request Interceptor
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

// Modular Token Refresh Interceptor
const shouldIntercept = (error: AxiosError) =>
  error.response?.status === 403 && (error.response?.data as any)?.message === 'jwt expired'

const setTokenData = async (tokenData: { accessToken: string; refreshToken: string }, axiosClient: typeof api) => {
  await saveAuthTokens(tokenData)
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${tokenData.accessToken}`
}

const handleTokenRefresh = async () => {
  const tokens = await refresh()
  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }
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
        .then((tokenData: { accessToken: string; refreshToken: string }) => {
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
