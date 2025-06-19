import { useInfiniteQuery } from '@tanstack/react-query'
import diaryApi from '~/apis/diary.api'
import { useAuth } from '~/hooks/use-auth'

export const useGetDiaries = (nameSearch?: string) => {
  const { user } = useAuth()

  return useInfiniteQuery({
    queryKey: ['diaries', user?.userId, nameSearch],
    queryFn: ({ pageParam }) => diaryApi.getDiaries(user?.userId ?? '', pageParam, 5, nameSearch),
    enabled: !!user?.userId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined
    }
  })
}
