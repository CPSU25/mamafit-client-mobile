import { useInfiniteQuery } from '@tanstack/react-query'
import dressService from '~/services/dress.service'

export const useGetDresses = (search?: string, styleId?: string) => {
  return useInfiniteQuery({
    queryKey: ['dresses', search, styleId],
    queryFn: ({ pageParam }) => dressService.getDresses(pageParam, 4, search, styleId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined
    }
  })
}
