import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/lib/redux-toolkit/hooks'
import { clearTokens, setTokens, StorageState } from '~/lib/redux-toolkit/slices/auth.slice'
import { RootState } from '~/lib/redux-toolkit/store'
import { useSecureStore } from './use-secure-store'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, tokens } = useAppSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const { get, remove } = useSecureStore<StorageState>()

  useEffect(() => {
    const checkTokens = async () => {
      try {
        setIsLoading(true)
        const storedTokens = await get('auth-storage')
        if (storedTokens && storedTokens.accessToken && storedTokens.refreshToken) {
          dispatch(setTokens(storedTokens))
        }
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        dispatch(clearTokens())
        setIsLoading(false)
      }
    }
    checkTokens()
  }, [dispatch, get])

  const handleLogout = async () => {
    try {
      await remove('auth-storage')
      dispatch(clearTokens())
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return {
    isLoading,
    isAuthenticated,
    tokens,
    handleLogout
  }
}
