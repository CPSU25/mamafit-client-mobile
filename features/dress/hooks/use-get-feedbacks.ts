import { useQuery } from '@tanstack/react-query'
import dressService from '~/services/dress.service'

export const useGetFeedbacks = (dressId: string) => {
  return useQuery({
    queryKey: ['feedbacks', dressId],
    queryFn: () => dressService.getFeedbacks(dressId),
    enabled: Boolean(dressId)
  })
}
