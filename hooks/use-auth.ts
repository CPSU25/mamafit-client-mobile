import { decodeJwt } from 'jose'
import { useCallback, useEffect, useState } from 'react'
import { useRefreshToken } from '~/features/auth/hooks/use-refresh-token'
import { useAppDispatch, useAppSelector } from '~/lib/redux-toolkit/hooks'
import { clear, setTokens, setUser, StorageState } from '~/lib/redux-toolkit/slices/auth.slice'
import { RootState } from '~/lib/redux-toolkit/store'
import { JwtUser } from '~/types/common'
import { useSecureStore } from './use-secure-store'

const isJwtExpired = (exp?: number, skew = 30_000) => !exp || Date.now() + skew >= exp * 1000

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, tokens, user } = useAppSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  const { get, remove, save } = useSecureStore<StorageState>()
  const { mutateAsync: refreshMutation } = useRefreshToken()

  const clearAuthState = useCallback(async () => {
    await remove('auth-storage')
    dispatch(clear())
  }, [dispatch, remove])

  useEffect(() => {
    let mounted = true

    const checkTokens = async () => {
      try {
        const storedTokens = await get('auth-storage')
        if (!mounted) return

        if (!storedTokens?.accessToken || !storedTokens?.refreshToken) {
          await clearAuthState()
          return
        }

        const decoded = decodeJwt<JwtUser>(storedTokens.accessToken)
        const expired = isJwtExpired(decoded.exp)

        if (expired) {
          try {
            const newTokens = await refreshMutation(storedTokens.refreshToken)

            if (!newTokens?.accessToken || !newTokens.refreshToken) {
              await clearAuthState()
              return
            }

            await save('auth-storage', newTokens)
            dispatch(setTokens(newTokens))

            const newDecoded = decodeJwt<JwtUser>(newTokens.accessToken)
            dispatch(setUser(newDecoded))
          } catch {
            await clearAuthState()
          } finally {
            if (mounted) setIsLoading(false)
          }
          return
        }

        dispatch(setTokens(storedTokens))
        dispatch(setUser(decoded))
      } catch (err) {
        console.error('Auth bootstrap failed:', err)
        await clearAuthState()
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    checkTokens()

    return () => {
      mounted = false
    }
  }, [dispatch, get, refreshMutation, remove, save, clearAuthState])

  const handleLogout = async () => {
    try {
      await clearAuthState()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return {
    isLoading,
    isAuthenticated,
    tokens,
    user,
    handleLogout
  }
}
