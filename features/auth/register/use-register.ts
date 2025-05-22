import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { registerFormSchema, RegisterFormSchema } from './validations'

export const useRegister = () => {
  const methods = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema)
  })

  return {
    methods
  }
}
