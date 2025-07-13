import { clsx, type ClassValue } from 'clsx'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { FieldErrors } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { AuthTokens } from '~/types/common'
import { ComponentOptionWithComponent } from '~/types/preset.type'
import { ORDERED_COMPONENTS_OPTIONS } from './constants/constants'
import { clear, setTokens } from './redux-toolkit/slices/auth.slice'
import { store } from './redux-toolkit/store'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isFormError = <T extends FieldErrors>(errors: T, fieldName: keyof T): boolean => {
  return Boolean(errors[fieldName])
}

export const isValidUrl = (url: unknown) => {
  if (typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const generateImageFileName = (extension: string = 'jpg'): string => {
  const timestamp = Date.now()
  const randomId = Math.floor(Math.random() * 10000)
  return `img-${timestamp}-${randomId}.${extension}`
}

export const validateImageConstraints = (
  fileSize?: number,
  width?: number,
  height?: number,
  maxSizeMB: number = 5,
  maxDimension: number = 1920
): { isValid: boolean; error?: string } => {
  // Check file size
  if (fileSize && fileSize > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB (current: ${formatFileSize(fileSize)})`
    }
  }

  // // Check dimensions
  // if (width && height && (width > maxDimension || height > maxDimension)) {
  //   return {
  //     isValid: false,
  //     error: `Image dimensions must be less than ${maxDimension}x${maxDimension}px (current: ${width}x${height}px)`
  //   }
  // }

  return { isValid: true }
}

export const getAuthTokens = async () => {
  try {
    const authData = await SecureStore.getItemAsync('auth-storage')
    return authData ? JSON.parse(authData) : null
  } catch (error) {
    console.error('Error getting auth tokens:', error)
    return null
  }
}

export const saveAuthTokens = async (tokens: AuthTokens): Promise<void> => {
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

export const clearAuthTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('auth-storage')
    store.dispatch(clear())
    router.replace('/profile')
  } catch (error) {
    console.error('Error clearing auth tokens:', error)
    throw error
  }
}

export const getOrderedComponentOptions = (options: ComponentOptionWithComponent[]) => {
  if (!Array.isArray(options)) return []

  return ORDERED_COMPONENTS_OPTIONS.map((key) => {
    const option = options.find((option) => option?.componentName === key)
    return option || null
  }).filter(Boolean)
}

export const formatVnPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '')

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }

  return digits
}
