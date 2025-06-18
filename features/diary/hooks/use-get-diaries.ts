import diaryApi from '~/apis/diary.api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'

export const useGetDiaries = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['diaries', user?.userId],
    queryFn: () => diaryApi.getDiaries(user?.userId ?? ''),
    enabled: !!user?.userId
  })
}
