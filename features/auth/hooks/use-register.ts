import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import authService from '~/services/auth.service'
import { registerFormSchema, RegisterFormSchema } from '../validations'

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
    mutationFn: authService.sendCode,
    onSuccess: () => {
      onRegisterSuccess()
    },
    onError: (error) => {
      methods.setError('email', { message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG })
    }
  })

  const resendCodeMutation = useMutation({
    mutationFn: authService.resendCode
  })

  const verifyCodeMutation = useMutation({
    mutationFn: authService.verifyCode,
    onSuccess: () => {
      onRegisterSuccess()
    },
    onError: (error) => {
      methods.resetField('code')
      methods.setError('code', { message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG })
    }
  })

  const completeRegisterMutation = useMutation({
    mutationFn: authService.completeRegister,
    onSuccess: () => {
      methods.reset()
      onRegisterSuccess()
    },
    onError: (error) => {
      methods.setError('password', {
        message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG
      })
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
