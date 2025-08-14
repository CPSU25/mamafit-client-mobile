import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import diaryService from '~/services/diary.service'

export const useGetAllDiaries = () => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['all-diaries', user?.userId],
    queryFn: () => diaryService.getDiaries(user?.userId ?? '', 1, 100),
    enabled: isAuthenticated
  })
}
