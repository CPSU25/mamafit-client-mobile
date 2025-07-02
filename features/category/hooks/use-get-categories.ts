import { useQuery } from '@tanstack/react-query'
import categoryService from '~/services/category.service'

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories
  })
}
