import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import authApi from '~/apis/auth.api'
import { useSecureStore } from '~/hooks/use-secure-store'
import { signInSchema, SignInSchema } from './validations'

export const useSignIn = () => {
  const router = useRouter()
  const methods = useForm<SignInSchema>({
    defaultValues: {
      identifier: '',
      password: ''
    },
    resolver: zodResolver(signInSchema)
  })
  const { save } = useSecureStore()

  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: async ({ data }) => {
      if (data) {
        const { accessToken, refreshToken } = data
        await save('auth-storage', { accessToken, refreshToken })
        router.replace('/profile')
      }
    },
    onError: (error) => {
      if (error.status === 401) {
        methods.setError('password', { message: 'Wrong credentials' })
      } else {
        methods.setError('password', { message: error.response?.data.errorMessage || 'Something went wrong!' })
      }
    }
  })

  return { methods, signInMutation }
}
