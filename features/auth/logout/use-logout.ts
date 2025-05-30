import authApi from '~/apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from 'expo-router'
import { useAuth } from '~/hooks/use-auth'

export const useLogout = () => {
  const { handleLogout } = useAuth()
  const navigation = useNavigation()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      handleLogout()
      navigation.reset({
        index: 0,
        routes: [{ name: 'profile' as never }]
      })
    }
  })

  return { logoutMutation }
}
