import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'
import { ComponentWithOptions } from '~/types/component.type'

class ComponentService {
  async getComponentsByStyleId(styleId: string) {
    const { data } = await api.get<BaseResponse<ComponentWithOptions[]>>(`component/preset/style/${styleId}`)

    return data.data
  }
}

const componentService = new ComponentService()
export default componentService
