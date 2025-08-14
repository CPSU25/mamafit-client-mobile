import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import orderService from '~/services/order.service'
import { cancelOrderFormSchema, CancelOrderFormSchema } from '../validations'

const defaultValues: CancelOrderFormSchema = {
  canceledReason: ''
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  const methods = useForm<CancelOrderFormSchema>({
    defaultValues,
    resolver: zodResolver(cancelOrderFormSchema)
  })

  const cancelOrderMutation = useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders-count'] })
      queryClient.invalidateQueries({ queryKey: ['order-items-milestones'] })
      queryClient.invalidateQueries({ queryKey: ['designer-info'] })
    },
    onError: (error) => {
      return toast.error(error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG)
    }
  })

  return { methods, cancelOrderMutation }
}
