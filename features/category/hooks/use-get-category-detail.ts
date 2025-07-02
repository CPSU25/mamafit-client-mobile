import { useQuery } from '@tanstack/react-query'
import categoryService from '~/services/category.service'

export const useGetCategoryDetail = (categoryId: string) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoryService.getCategoryDetail(categoryId),
    enabled: !!categoryId
  })
}
