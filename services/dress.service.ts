import { api } from '~/lib/axios/axios'
import { BasePaginationResponse, BaseResponse, Style } from '~/types/common'
import { Dress, DressDetail, DressVariant } from '~/types/dress.type'
import { Feedback } from '~/types/feedback.type'

class DressService {
  async getDresses(page: number = 1, pageSize: number = 4, search?: string, styleId?: string) {
    let baseUrl = `maternity-dress?index=${page}&pageSize=${pageSize}`
    if (search) baseUrl += `&search=${search}`
    if (styleId) baseUrl += `&styleId=${styleId}`

    const { data } = await api.get<BasePaginationResponse<Dress>>(baseUrl)

    return data.data
  }

  async getDress(dressId: string) {
    const { data } = await api.get<BaseResponse<DressDetail>>(`maternity-dress/${dressId}`)

    return data.data
  }

  async getDressDetail(dressDetailId: string) {
    const { data } = await api.get<BaseResponse<DressVariant>>(`maternity-dress-detail/${dressDetailId}`)

    return data.data
  }

  async getStyles(page: number = 1, pageSize: number = 999) {
    const { data } = await api.get<BasePaginationResponse<Style>>(`style?index=${page}&pageSize=${pageSize}`)

    return data.data
  }

  async getFeedbacks(dressId: string) {
    const { data } = await api.get<BaseResponse<Feedback[]>>(`feedback/maternity-dress/${dressId}`)

    const feedbacks = (data?.data ?? []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const totalFeedbacks = feedbacks.length
    const totalRating = feedbacks.reduce((sum, f) => sum + f.rated, 0)
    const averageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0

    return {
      feedbacks,
      averageRating,
      totalFeedbacks
    }
  }
}

const dressService = new DressService()
export default dressService
