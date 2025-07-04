import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import diaryService from '~/services/diary.service'

export const useGetWeekOfPregnancy = (diaryId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['week-of-pregnancy', diaryId, user?.userId],
    queryFn: () => diaryService.getWeekOfPregnancy(diaryId),
    enabled: isAuthenticated
  })
}
