import { useMutation } from '@tanstack/react-query'
import * as Updates from 'expo-updates'
import authApi from '~/apis/auth.api'
import { useAuth } from '~/hooks/use-auth'

export const useLogout = () => {
  const { handleLogout } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      handleLogout()
      await Updates.reloadAsync()
    }
  })

  return { logoutMutation }
}
