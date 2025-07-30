import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'
import { PresetWithComponentOptions } from '~/types/preset.type'

class PresetService {
  async getDefaultPreset(styleId: string) {
    const { data } = await api.get<BaseResponse<PresetWithComponentOptions>>(`preset/default/${styleId}`)

    return data.data
  }

  async getPreset(componentOptionIds: string[]) {
    const { data } = await api.post<BaseResponse<PresetWithComponentOptions[]>>(`preset/component-option`, [
      ...componentOptionIds
    ])

    return data.data?.[0] ?? null
  }

  async getPresetDetail(presetId: string) {
    const { data } = await api.get<BaseResponse<PresetWithComponentOptions>>(`preset/${presetId}`)

    return data.data
  }
}

const presetService = new PresetService()
export default presetService
