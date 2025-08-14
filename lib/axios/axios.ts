import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { AuthTokens } from '~/types/common'
import { refreshAuthTokens } from '../auth'
import { getAuthTokens, saveAuthTokens } from '../utils'

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL
if (!baseURL) throw new Error('EXPO_PUBLIC_API_BASE_URL is not defined')

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const ghtkBaseURL = process.env.EXPO_PUBLIC_API_BASE_URL
if (!ghtkBaseURL) throw new Error('EXPO_PUBLIC_API_BASE_URL is not defined')

export const ghtkApi = axios.create({
  baseURL: ghtkBaseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Use centralized token refresh

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
    return await refreshAuthTokens()
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
