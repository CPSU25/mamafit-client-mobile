import { api } from '~/lib/axios/axios'
import { store } from '~/lib/redux-toolkit/store'
import { BaseResponse } from '~/types/common'
import { CreateDiaryInput, Diary, PreviewDiaryInput, PreviewDiaryResponse } from '~/types/diary.type'

const diaryApi = {
  getDiaries: async (userId: string) => {
    const { data } = await api.get<BaseResponse<Diary[]>>(`/measurement-diary/user/${userId}`)

    return data.data
  },
  previewDiary: async (inputs: PreviewDiaryInput) => {
    const { user } = store.getState().auth
    if (!user?.userId) return

    const { data } = await api.post<BaseResponse<PreviewDiaryResponse>>('measurement/preview-diary', {
      userId: user?.userId,
      ...inputs
    })

    return data.data
  },
  createDiary: async (inputs: CreateDiaryInput) => {
    const { user } = store.getState().auth
    if (!user?.userId) return

    const { data } = await api.post<BaseResponse<{ diaryId: string }>>('measurement/submit', {
      ...inputs,
      diary: {
        ...inputs.diary,
        userId: user?.userId
      }
    })

    return data.data
  }
}

export default diaryApi
