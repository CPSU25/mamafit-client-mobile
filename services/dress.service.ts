import { api } from '~/lib/axios/axios'
import { BasePaginationResponse, BaseResponse, Style } from '~/types/common'
import { AutocompleteDress, Dress, DressDetail, DressVariant } from '~/types/dress.type'
import { Feedback } from '~/types/feedback.type'
import { OrderItemType } from '~/types/order.type'

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

  async getFeedbacksByType(itemType: OrderItemType) {
    const { data } = await api.get<BaseResponse<Feedback[]>>(`feedback/item-type`, {
      params: {
        itemType
      }
    })

    return data.data?.filter((f) => f.rated >= 4)
  }

  async getAutocomplete(search: string) {
    const { data } = await api.get<BaseResponse<AutocompleteDress[]>>(`maternity-dress/autocomplete`, {
      params: {
        query: search
      }
    })

    return data.data
  }
}

const dressService = new DressService()
export default dressService
