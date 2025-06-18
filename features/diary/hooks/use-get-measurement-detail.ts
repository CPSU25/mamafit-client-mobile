import { useQuery } from '@tanstack/react-query'
import diaryApi from '~/apis/diary.api'

export const useGetMeasurementDetail = (measurementId: string) => {
  return useQuery({
    queryKey: ['measurement-detail', measurementId],
    queryFn: () => diaryApi.getMeasurementDetail(measurementId)
  })
}
