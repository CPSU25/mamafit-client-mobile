import { api } from '~/lib/axios/axios'
import { BaseResponse, User } from '~/types/common'

class UserService {
  async getProfile(userId: string | undefined) {
    if (!userId) return null

    const { data } = await api.get<BaseResponse<User>>(`user/${userId}`)
    return data.data
  }
}

const userService = new UserService()
export default userService
