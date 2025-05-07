import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearTokens, setTokens, StorageState } from '~/lib/redux-toolkit/slices/auth.slice'
import { RootState } from '~/lib/redux-toolkit/store'
import { useSecureStore } from './use-secure-store'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, tokens } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const { get } = useSecureStore<StorageState>()

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

  return {
    isLoading,
    isAuthenticated,
    tokens
  }
}
