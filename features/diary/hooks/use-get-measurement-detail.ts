import { useQuery } from '@tanstack/react-query'
import diaryService from '~/services/diary.service'

export const useGetMeasurementDetail = (measurementId: string) => {
  return useQuery({
    queryKey: ['measurement-detail', measurementId],
    queryFn: () => diaryService.getMeasurementDetail(measurementId)
  })
}
