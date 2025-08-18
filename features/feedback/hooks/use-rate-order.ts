import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { rateOrderFormSchema, RateOrderFormSchema } from '../validations'

const defaultValues: RateOrderFormSchema = {
  ratings: []
}

export const useRateOrder = () => {
  const methods = useForm<RateOrderFormSchema>({
    defaultValues,
    resolver: zodResolver(rateOrderFormSchema)
  })

  return { methods }
}
