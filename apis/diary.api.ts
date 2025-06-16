import { CreateDiaryInput } from '~/features/diary/create-diary/validations'
import { api } from '~/lib/axios/axios'
import { store } from '~/lib/redux-toolkit/store'
import { BaseResponse } from '~/types/common'
import { PreviewDiaryResponse } from '~/types/diary.type'

const diaryApi = {
  previewDiary: async (inputs: CreateDiaryInput) => {
    const { user } = store.getState().auth
    const { data } = await api.post<BaseResponse<PreviewDiaryResponse>>('measurement/preview-diary', {
      userId: user?.userId,
      ...inputs
    })

    return data.data
  }
}

export default diaryApi
