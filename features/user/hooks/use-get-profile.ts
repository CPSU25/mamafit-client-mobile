import userApi from '~/apis/user.api'
import { useQuery } from '@tanstack/react-query'

export const useGetProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userApi.getProfile(userId),
    enabled: !!userId
  })
}
