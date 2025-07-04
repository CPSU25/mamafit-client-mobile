import { useMutation } from '@tanstack/react-query'
import * as Updates from 'expo-updates'
import { useAuth } from '~/hooks/use-auth'
import authService from '~/services/auth.service'
import chatHubService from '~/services/signalr/chat-hub.service'
import notificationHubService from '~/services/signalr/notification-hub.service'

export const useLogout = () => {
  const { handleLogout } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      handleLogout()
      chatHubService.destroy()
      notificationHubService.destroy()
      await Updates.reloadAsync()
    }
  })

  return { logoutMutation }
}
