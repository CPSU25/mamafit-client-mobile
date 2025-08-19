import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import feedbackService from '~/services/feedback.service'
import { rateOrderFormSchema, RateOrderFormSchema } from '../validations'

const defaultValues: RateOrderFormSchema = {
  ratings: []
}

export const useRateOrder = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const methods = useForm<RateOrderFormSchema>({
    defaultValues,
    resolver: zodResolver(rateOrderFormSchema)
  })

  const rateOrderMutation = useMutation({
    mutationFn: feedbackService.rateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback-status'] })
      queryClient.invalidateQueries({ queryKey: ['rated-orders'] })
      queryClient.invalidateQueries({ queryKey: ['unrated-orders'] })

      router.replace('/order/feedback/rated')
    }
  })

  return { methods, rateOrderMutation }
}
