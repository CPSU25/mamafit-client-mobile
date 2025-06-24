import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { decodeJwt } from 'jose'
import { useForm } from 'react-hook-form'
import { useAuth } from '~/hooks/use-auth'
import { useSecureStore } from '~/hooks/use-secure-store'
import { AuthTokens } from '~/lib/axios/axios'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import authService from '~/services/auth.service'
import { JwtUser } from '~/types/common'
import { SignInSchema, signInSchema } from '../validations'

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
    mutationFn: authService.signIn,
    onSuccess: async ({ data }) => {
      if (data) {
        const { accessToken, refreshToken } = data

        try {
          const user = decodeJwt<JwtUser>(accessToken)
          if (user && user.role === 'User') {
            await save('auth-storage', { accessToken, refreshToken })
            router.replace('/profile')
          } else {
            await handleLogout()
            methods.reset()
            methods.setError('root', { message: ERROR_MESSAGES.INSUFFICIENT_PERMISSION })
          }
        } catch {
          await handleLogout()
          methods.reset()
          methods.setError('root', { message: ERROR_MESSAGES.SOMETHING_WENT_WRONG })
        }
      }
    },
    onError: (error) => {
      if (error.status === 401) {
        methods.setError('root', { message: ERROR_MESSAGES.WRONG_CREDENTIALS })
      } else {
        methods.setError('root', { message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG })
      }
    }
  })

  return { methods, signInMutation }
}
