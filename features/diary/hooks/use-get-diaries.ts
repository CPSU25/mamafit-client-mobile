import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import diaryService from '~/services/diary.service'

export const useGetDiaries = (nameSearch?: string) => {
  const { isAuthenticated, user } = useAuth()

  return useInfiniteQuery({
    queryKey: ['diaries', user?.userId, nameSearch],
    queryFn: ({ pageParam }) => diaryService.getDiaries(user?.userId ?? '', pageParam, 5, nameSearch),
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined
    }
  })
}
