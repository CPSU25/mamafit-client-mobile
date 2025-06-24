import { useQuery } from '@tanstack/react-query'
import diaryService from '~/services/diary.service'

export const useGetWeekOfPregnancy = (diaryId: string) => {
  return useQuery({
    queryKey: ['week-of-pregnancy', diaryId],
    queryFn: () => diaryService.getWeekOfPregnancy(diaryId)
  })
}
