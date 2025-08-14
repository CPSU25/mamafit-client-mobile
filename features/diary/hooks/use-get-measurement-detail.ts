import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import diaryService from '~/services/diary.service'

export const useGetMeasurementDetail = (measurementId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['measurement-detail', measurementId, user?.userId],
    queryFn: () => diaryService.getMeasurementDetail(measurementId),
    enabled: isAuthenticated
  })
}
