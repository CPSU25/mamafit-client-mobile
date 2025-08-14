import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import categoryService from '~/services/category.service'

export const useGetCategoryDetail = (categoryId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['category', categoryId, user?.userId],
    queryFn: () => categoryService.getCategoryDetail(categoryId),
    enabled: !!categoryId && isAuthenticated
  })
}
