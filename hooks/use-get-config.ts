import { useQuery } from '@tanstack/react-query'
import contentfulService from '~/services/contentful.service'
import { useAuth } from './use-auth'

export const useGetConfig = () => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['config', user?.userId],
    queryFn: contentfulService.getConfig,
    enabled: isAuthenticated
  })
}
