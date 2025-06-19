import { PreviewMeasurementFormOutput } from '~/features/diary/validations'
import { api } from '~/lib/axios/axios'
import { store } from '~/lib/redux-toolkit/store'
import { BasePaginationResponse, BaseResponse } from '~/types/common'
import {
  CreateDiaryInput,
  CreateMeasurementInput,
  Diary,
  DiaryDetail,
  EditMeasurementDetailInput,
  GetDiaryDetailFilters,
  Measurement,
  PreviewDiaryInput
} from '~/types/diary.type'

const diaryApi = {
  getDiaries: async (userId: string, page: number = 1, pageSize: number = 5, nameSearch?: string) => {
    const { data } = await api.get<BasePaginationResponse<Diary>>(
      `/measurement-diary/userId?userId=${userId}&index=${page}&pageSize=${pageSize}${nameSearch ? `&nameSearch=${nameSearch}` : ''}`
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
  },
  getMeasurementDetail: async (measurementId: string) => {
    const { data } = await api.get<BaseResponse<Measurement>>(`/measurement/${measurementId}`)
    return data.data
  },
  getWeekOfPregnancy: async (diaryId: string) => {
    const { data } = await api.get<BaseResponse<Measurement>>(`/measurement-diary/weeks-pregnant/${diaryId}`)

    return data.data
  },
  editMeasurementDetail: async ({
    measurementId,
    inputs
  }: {
    measurementId: string
    inputs: EditMeasurementDetailInput
  }) => {
    const { data } = await api.put<BaseResponse<Measurement>>(`/measurement/${measurementId}`, inputs)

    return data.data
  },
  previewMeasurement: async (inputs: PreviewMeasurementFormOutput) => {
    const { data } = await api.post<BaseResponse<Measurement>>('measurement/preview-measurement', inputs)

    return data.data
  },
  createMeasurement: async (inputs: CreateMeasurementInput) => {
    const { data } = await api.post<BaseResponse<Measurement>>('measurement/create-measurement', inputs)

    return data.data
  }
}

export default diaryApi
