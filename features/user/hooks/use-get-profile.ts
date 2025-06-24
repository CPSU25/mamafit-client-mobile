import { useQuery } from '@tanstack/react-query'
import userService from '~/services/user.service'

export const useGetProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userService.getProfile(userId),
    enabled: !!userId
  })
}
