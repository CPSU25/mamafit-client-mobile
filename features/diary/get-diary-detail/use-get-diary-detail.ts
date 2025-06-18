import { keepPreviousData, useQuery } from '@tanstack/react-query'
import diaryApi from '~/apis/diary.api'
import { GetDiaryDetailFilters } from '~/types/diary.type'

export const useGetDiaryDetail = ({ diaryId, startDate, endDate }: GetDiaryDetailFilters) => {
  return useQuery({
    queryKey: ['diary-detail', diaryId, startDate, endDate],
    queryFn: () => diaryApi.getDiaryDetail({ diaryId, startDate, endDate }),
    placeholderData: keepPreviousData
  })
}
