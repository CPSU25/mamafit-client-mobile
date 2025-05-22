import { useForm } from 'react-hook-form'
import { signInSchema, SignInSchema } from './validations'
import { zodResolver } from '@hookform/resolvers/zod'

export const useSignIn = () => {
  const methods = useForm<SignInSchema>({
    defaultValues: {
      identifier: '',
      password: ''
    },
    resolver: zodResolver(signInSchema)
  })

  return { methods }
}
