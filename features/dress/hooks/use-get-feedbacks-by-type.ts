import { useQuery } from '@tanstack/react-query'
import dressService from '~/services/dress.service'
import { OrderItemType } from '~/types/order.type'

export const useGetFeedbacksByType = (itemType: OrderItemType) => {
  return useQuery({
    queryKey: ['feedbacks-by-type', itemType],
    queryFn: () => dressService.getFeedbacksByType(itemType)
  })
}
