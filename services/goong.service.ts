import axios from 'axios'
import { ForwardGeocodingResponse } from '~/types/common'

if (!process.env.EXPO_PUBLIC_GOONG_MAP_API_KEY) {
  throw new Error('EXPO_PUBLIC_GOONG_MAP_API_KEY is not set')
}

class GoongService {
  private readonly apiKey = process.env.EXPO_PUBLIC_GOONG_MAP_API_KEY
  private readonly baseUrl = 'https://rsapi.goong.io'

  async forwardGeocoding(address: string) {
    const { data } = await axios.get<ForwardGeocodingResponse>(`${this.baseUrl}/geocode`, {
      params: {
        address,
        api_key: this.apiKey
      }
    })

    return data.results
  }
}

const goongService = new GoongService()
export default goongService
