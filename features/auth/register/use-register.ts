import authApi from '~/apis/auth.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { registerFormSchema, RegisterFormSchema } from './validations'

interface UseRegisterProps {
  onRegisterSuccess: () => void
}

export const useRegister = ({ onRegisterSuccess }: UseRegisterProps) => {
  const methods = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      code: '',
      password: '',
      phoneNumber: ''
    }
  })

  const sendCodeMutation = useMutation({
    mutationFn: authApi.sendCode,
    onSuccess: () => {
      onRegisterSuccess()
    },
    onError: (error) => {
      methods.setError('email', { message: error.response?.data.errorMessage || 'Something went wrong!' })
    }
  })

  const resendCodeMutation = useMutation({
    mutationFn: authApi.resendCode
  })

  const verifyCodeMutation = useMutation({
    mutationFn: authApi.verifyCode,
    onSuccess: () => {
      onRegisterSuccess()
    },
    onError: (error) => {
      methods.resetField('code')
      methods.setError('code', { message: error.response?.data.errorMessage || 'Something went wrong!' })
    }
  })

  const completeRegisterMutation = useMutation({
    mutationFn: authApi.completeRegister,
    onSuccess: () => {
      methods.reset()
      onRegisterSuccess()
    },
    onError: (error) => {
      methods.setError('password', { message: error.response?.data.errorMessage || 'Something went wrong!' })
    }
  })

  return {
    methods,
    sendCodeMutation,
    resendCodeMutation,
    verifyCodeMutation,
    completeRegisterMutation
  }
}
