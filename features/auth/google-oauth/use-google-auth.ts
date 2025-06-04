import authApi from '~/apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useSecureStore } from '~/hooks/use-secure-store'
import { AuthTokens } from '~/lib/axios/axios'

export const useGoogleAuth = () => {
  const router = useRouter()
  const { save } = useSecureStore<AuthTokens>()

  return useMutation({
    mutationFn: authApi.signInWithGoogle,
    onSuccess: async ({ data }) => {
      if (data) {
        const { accessToken, refreshToken } = data
        await save('auth-storage', { accessToken, refreshToken })
        router.replace('/profile')
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })
}
