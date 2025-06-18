import { api } from '~/lib/axios/axios'
import { store } from '~/lib/redux-toolkit/store'
import { BasePaginationResponse, BaseResponse } from '~/types/common'
import {
  CreateDiaryInput,
  Diary,
  DiaryDetail,
  GetDiaryDetailFilters,
  Measurement,
  PreviewDiaryInput
} from '~/types/diary.type'

const diaryApi = {
  getDiaries: async (userId: string) => {
    // TODO: add pagination
    const { data } = await api.get<BasePaginationResponse<Diary>>(
      `/measurement-diary/userId?userId=${userId}&index=1&pageSize=10`
    )
    const sortedDiaries = {
      ...data.data,
      items: data.data.items.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    }

    return sortedDiaries
  },
  getDiaryDetail: async ({ diaryId, startDate, endDate }: GetDiaryDetailFilters) => {
    let url = `/measurement-diary/${diaryId}`
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`
    }

    const { data } = await api.get<BaseResponse<DiaryDetail>>(url)

    return data.data
  },
  previewDiary: async (inputs: PreviewDiaryInput) => {
    const { user } = store.getState().auth
    if (!user?.userId) return

    const { data } = await api.post<BaseResponse<Measurement>>('measurement/preview-diary', {
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
