import * as SecureStore from 'expo-secure-store'
import { useCallback } from 'react'

type SecureStoreValue = string | number | boolean | object

interface SecureStoreReturnType<T extends SecureStoreValue> {
  save: (key: string, value: T) => Promise<void>
  get: (key: string) => Promise<T | null>
  remove: (key: string) => Promise<void>
}

export const useSecureStore = <T extends SecureStoreValue>(): SecureStoreReturnType<T> => {
  const save = useCallback(async (key: string, value: T) => {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
      await SecureStore.setItemAsync(key, stringValue)
    } catch (error) {
      console.error(`Error saving ${key} to secure store:`, error)
      throw error
    }
  }, [])

  const get = useCallback(async (key: string): Promise<T | null> => {
    try {
      const value = await SecureStore.getItemAsync(key)
      if (value === null) return null

      try {
        return JSON.parse(value) as T
      } catch {
        if (typeof ({} as T) === 'number') {
          const num = Number(value)
          return (isNaN(num) ? null : num) as T
        }
        if (typeof ({} as T) === 'boolean') {
          return (value === 'true') as T
        }
        return value as T
      }
    } catch (error) {
      console.error(`Error getting ${key} from secure store:`, error)
      throw error
    }
  }, [])

  const remove = useCallback(async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key)
    } catch (error) {
      console.error(`Error removing ${key} from secure store:`, error)
      throw error
    }
  }, [])

  return { save, get, remove }
}
