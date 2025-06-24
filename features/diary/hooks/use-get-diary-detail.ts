import { keepPreviousData, useQuery } from '@tanstack/react-query'
import diaryService from '~/services/diary.service'
import { GetDiaryDetailFilters } from '~/types/diary.type'

export const useGetDiaryDetail = ({ diaryId, startDate, endDate }: GetDiaryDetailFilters) => {
  return useQuery({
    queryKey: ['diary-detail', diaryId, startDate, endDate],
    queryFn: () => diaryService.getDiaryDetail({ diaryId, startDate, endDate }),
    placeholderData: keepPreviousData
  })
}
