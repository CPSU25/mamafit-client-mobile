import { useQuery } from '@tanstack/react-query'
import dressService from '~/services/dress.service'

export const useGetDress = (dressId: string) => {
  return useQuery({
    queryKey: ['dress', dressId],
    queryFn: () => dressService.getDress(dressId),
    enabled: Boolean(dressId)
  })
}
