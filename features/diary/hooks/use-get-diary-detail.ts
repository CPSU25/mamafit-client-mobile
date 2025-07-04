import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import diaryService from '~/services/diary.service'
import { GetDiaryDetailFilters } from '~/types/diary.type'

export const useGetDiaryDetail = ({ diaryId, startDate, endDate }: GetDiaryDetailFilters) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['diary-detail', diaryId, startDate, endDate, user?.userId],
    queryFn: () => diaryService.getDiaryDetail({ diaryId, startDate, endDate }),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated
  })
}
