import authApi from '~/apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useAuth } from '~/hooks/use-auth'

export const useLogout = () => {
  const { handleLogout } = useAuth()
  const router = useRouter()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      handleLogout()
      router.replace('/profile')
    }
  })

  return { logoutMutation }
}
