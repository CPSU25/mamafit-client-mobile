import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createRequestSchema, CreateRequestSchema } from '../validations'

export const useCreateRequest = () => {
  const methods = useForm<CreateRequestSchema>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      description: '',
      images: []
    }
  })

  return { methods }
}
