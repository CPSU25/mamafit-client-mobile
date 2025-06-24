import { clsx, type ClassValue } from 'clsx'
import { FieldErrors } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

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
