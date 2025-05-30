import authApi from '~/apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'

export const useLogout = () => {
  const { handleLogout } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      handleLogout()
    }
  })

  return { logoutMutation }
}
