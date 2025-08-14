import { api } from '~/lib/axios/axios'
import { BaseResponse } from '~/types/common'
import { VoucherBatchWithVouchers } from '~/types/voucher.type'

class VoucherService {
  async getVouchers() {
    const { data } = await api.get<BaseResponse<VoucherBatchWithVouchers[]>>('voucher-batch/my-discounts')

    return data.data
  }
}

const voucherService = new VoucherService()
export default voucherService
