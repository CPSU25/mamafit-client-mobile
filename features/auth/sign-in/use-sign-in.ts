import authApi from '~/apis/auth.api'
import { useForm } from 'react-hook-form'
import { signInSchema, SignInSchema } from './validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useSecureStore } from '~/hooks/use-secure-store'
import { useRouter } from 'expo-router'

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
    }
  })

  return { methods, signInMutation }
}
