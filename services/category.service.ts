import { api } from '~/lib/axios/axios'
import { BasePaginationResponse, BaseResponse, Category, StylesByCategoryResponse } from '~/types/common'

class CategoryService {
  async getCategories() {
    // TODO: Add pagination
    const { data } = await api.get<BasePaginationResponse<Category>>('category')

    return data.data.items
  }

  async getCategoryDetail(categoryId: string) {
    const { data } = await api.get<BaseResponse<StylesByCategoryResponse>>(`/category/${categoryId}`)

    return data.data
  }
}

const categoryService = new CategoryService()
export default categoryService
