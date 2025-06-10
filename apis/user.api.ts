import { api } from '~/lib/axios/axios'
import { BaseResponse, User } from '~/types/common'

const userApi = {
  getProfile: async (userId: string | undefined) => {
    if (!userId) return null

    const { data } = await api.get<BaseResponse<User>>(`user/${userId}`)
    return data
  }
}

export default userApi
