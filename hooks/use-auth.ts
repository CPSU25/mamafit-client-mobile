import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/lib/redux-toolkit/hooks'
import { clear, setTokens, setUser, StorageState } from '~/lib/redux-toolkit/slices/auth.slice'
import { RootState } from '~/lib/redux-toolkit/store'
import { useSecureStore } from './use-secure-store'
import { decodeJwt } from 'jose'
import { JwtUser } from '~/types/common'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, tokens, user } = useAppSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const { get, remove } = useSecureStore<StorageState>()

  useEffect(() => {
    let mounted = true

    const checkTokens = async () => {
      try {
        const storedTokens = await get('auth-storage')
        if (mounted) {
          if (storedTokens && storedTokens.accessToken && storedTokens.refreshToken) {
            dispatch(setTokens(storedTokens))
            const decodedToken = decodeJwt<JwtUser>(storedTokens.accessToken)
            dispatch(setUser(decodedToken))
          } else {
            dispatch(clear())
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error checking tokens:', error)
        if (mounted) {
          dispatch(clear())
          setIsLoading(false)
        }
      }
    }

    checkTokens()

    return () => {
      mounted = false
    }
  }, [dispatch, get])

  const handleLogout = async () => {
    try {
      await remove('auth-storage')
      dispatch(clear())
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
