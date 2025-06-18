import { useQuery } from '@tanstack/react-query'
import diaryApi from '~/apis/diary.api'

export const useGetWeekOfPregnancy = (diaryId: string) => {
  return useQuery({
    queryKey: ['week-of-pregnancy', diaryId],
    queryFn: () => diaryApi.getWeekOfPregnancy(diaryId)
  })
}
