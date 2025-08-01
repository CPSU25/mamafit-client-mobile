import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createWarrantyRequestSchema, CreateWarrantyRequestSchema } from '../validations'

const defaultValues: CreateWarrantyRequestSchema = {
  orderItemId: '123',
  images: [],
  description: ''
}

export const useCreateWarrantyRequest = () => {
  const methods = useForm<CreateWarrantyRequestSchema>({
    defaultValues,
    resolver: zodResolver(createWarrantyRequestSchema)
  })

  return { methods }
}
