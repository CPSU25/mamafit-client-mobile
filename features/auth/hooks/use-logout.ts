import { useMutation } from '@tanstack/react-query'
import * as Updates from 'expo-updates'
import { useAuth } from '~/hooks/use-auth'
import authService from '~/services/auth.service'
import signalRService from '~/services/signalr.service'

export const useLogout = () => {
  const { handleLogout } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      handleLogout()
      await signalRService.disconnect()
      await Updates.reloadAsync()
    }
  })

  return { logoutMutation }
}
