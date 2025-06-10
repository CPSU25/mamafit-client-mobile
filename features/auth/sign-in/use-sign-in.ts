import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import authApi from '~/apis/auth.api'
import { useSecureStore } from '~/hooks/use-secure-store'
import { AuthTokens } from '~/lib/axios/axios'
import { signInSchema, SignInSchema } from './validations'
import { useAuth } from '~/hooks/use-auth'
import { JwtUser } from '~/types/common'
import { decodeJwt } from 'jose'

export const useSignIn = () => {
  const router = useRouter()
  const methods = useForm<SignInSchema>({
    defaultValues: {
      identifier: '',
      password: ''
    },
    resolver: zodResolver(signInSchema)
  })
  const { save } = useSecureStore<AuthTokens>()
  const { handleLogout } = useAuth()

  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: async ({ data }) => {
      if (data) {
        const { accessToken, refreshToken } = data
        await save('auth-storage', { accessToken, refreshToken })

        try {
          const user = decodeJwt<JwtUser>(accessToken)
          if (user && user.role === 'User') {
            router.replace('/profile')
          } else {
            await handleLogout()
            methods.reset()
            methods.setError('root', { message: 'You are not authorized to access this app' })
          }
        } catch {
          await handleLogout()
          methods.reset()
          methods.setError('root', { message: 'Something went wrong!' })
        }
      }
    },
    onError: (error) => {
      if (error.status === 401) {
        methods.setError('root', { message: 'Wrong credentials' })
      } else {
        methods.setError('root', { message: error.response?.data.errorMessage || 'Something went wrong!' })
      }
    }
  })

  return { methods, signInMutation }
}
