import { ghtkApi } from '~/lib/axios/axios'
import { GHTKFeeResponse } from '~/types/ghtk.type'

class GHTKService {
  async getShippingFee({ province, district, weight }: { province: string; district: string; weight: number }) {
    const { data } = await ghtkApi.get<GHTKFeeResponse>('ghtk-fee', {
      params: {
        Province: province,
        District: district,
        Weight: weight
      }
    })

    return data.fee.fee
  }
}

const ghtkService = new GHTKService()
export default ghtkService
