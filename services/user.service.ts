import { AddAddressFormSchema } from '~/features/user/validations'
import { api } from '~/lib/axios/axios'
import { Address } from '~/types/address.type'
import { BaseResponse, User } from '~/types/common'

class UserService {
  async getProfile(userId: string | undefined) {
    if (!userId) return null

    const { data } = await api.get<BaseResponse<User>>(`user/${userId}`)
    return data.data
  }

  async addAddress(address: AddAddressFormSchema) {
    const { data } = await api.post<BaseResponse<null>>(`address`, address)

    return data.data
  }

  async getAddresses() {
    const { data } = await api.get<BaseResponse<Address[]>>(`address/by-token`)

    return data.data
  }
}

const userService = new UserService()
export default userService
