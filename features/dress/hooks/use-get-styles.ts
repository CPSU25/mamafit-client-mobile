import { useInfiniteQuery } from '@tanstack/react-query'
import dressService from '~/services/dress.service'

export const useGetStyles = () => {
  return useInfiniteQuery({
    queryKey: ['styles'],
    queryFn: ({ pageParam }) => dressService.getStyles(pageParam, 999),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined
    }
  })
}
