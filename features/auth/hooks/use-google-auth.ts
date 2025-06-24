import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useSecureStore } from '~/hooks/use-secure-store'
import { AuthTokens } from '~/lib/axios/axios'
import authService from '~/services/auth.service'

export const useGoogleAuth = () => {
  const router = useRouter()
  const { save } = useSecureStore<AuthTokens>()

  return useMutation({
    mutationFn: authService.signInWithGoogle,
    onSuccess: async ({ data }) => {
      if (data) {
        const { accessToken, refreshToken } = data
        await save('auth-storage', { accessToken, refreshToken })
        await GoogleSignin.revokeAccess()
        router.replace('/profile')
      }
    },
    onError: async (error) => {
      await GoogleSignin.revokeAccess()
      console.log(error)
    }
  })
}
