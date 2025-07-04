import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import categoryService from '~/services/category.service'

export const useGetCategories = () => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['categories', user?.userId],
    queryFn: categoryService.getCategories,
    enabled: isAuthenticated
  })
}
