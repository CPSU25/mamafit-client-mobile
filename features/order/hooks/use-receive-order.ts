import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import orderService from '~/services/order.service'

export const useReceiveOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orderService.receiveOrder,
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
}
