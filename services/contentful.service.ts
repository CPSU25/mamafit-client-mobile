import { api } from '~/lib/axios/axios'
import { AppConfig, BaseResponse } from '~/types/common'

class ContentfulService {
  async getConfig() {
    const { data } = await api.get<BaseResponse<AppConfig>>('config')

    return data.data?.fields
  }
}

const contentfulService = new ContentfulService()
export default contentfulService
