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

class DiaryService {
  /**
   * Get paginated list of diaries for a user
   * @param userId User ID
   * @param page Page number
   * @param pageSize Number of items per page
   * @param nameSearch Optional search term
   * @returns Promise that resolves to paginated diary list
   */
  async getDiaries(userId: string, page: number = 1, pageSize: number = 5, nameSearch?: string) {
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
  }

  /**
   * Get diary detail with optional date filters
   * @param diaryId Diary ID
   * @param startDate Optional start date filter
   * @param endDate Optional end date filter
   * @returns Promise that resolves to diary detail
   */
  async getDiaryDetail({ diaryId, startDate, endDate }: GetDiaryDetailFilters) {
    let url = `/measurement-diary/${diaryId}`
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`
    }

    const { data } = await api.get<BaseResponse<DiaryDetail>>(url)
    return data.data
  }

  /**
   * Preview diary with given inputs
   * @param inputs Preview diary input data
   * @returns Promise that resolves to measurement preview
   */
  async previewDiary(inputs: PreviewDiaryInput) {
    const { user } = store.getState().auth
    if (!user?.userId) return

    const { data } = await api.post<BaseResponse<Measurement>>('measurement/preview-diary', {
      userId: user?.userId,
      ...inputs
    })
    return data.data
  }

  /**
   * Create a new diary
   * @param inputs Create diary input data
   * @returns Promise that resolves to created diary info
   */
  async createDiary(inputs: CreateDiaryInput) {
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

  /**
   * Get measurement detail by ID
   * @param measurementId Measurement ID
   * @returns Promise that resolves to measurement detail
   */
  async getMeasurementDetail(measurementId: string) {
    const { data } = await api.get<BaseResponse<Measurement>>(`/measurement/${measurementId}`)
    return data.data
  }

  /**
   * Get week of pregnancy for a diary
   * @param diaryId Diary ID
   * @returns Promise that resolves to week of pregnancy data
   */
  async getWeekOfPregnancy(diaryId: string) {
    const { data } = await api.get<BaseResponse<Measurement>>(`/measurement-diary/weeks-pregnant/${diaryId}`)
    return data.data
  }

  /**
   * Edit measurement detail
   * @param measurementId Measurement ID
   * @param inputs Edit measurement input data
   * @returns Promise that resolves to updated measurement
   */
  async editMeasurementDetail({
    measurementId,
    inputs
  }: {
    measurementId: string
    inputs: EditMeasurementDetailInput
  }) {
    const { data } = await api.put<BaseResponse<Measurement>>(`/measurement/${measurementId}`, inputs)
    return data.data
  }

  /**
   * Preview measurement with given inputs
   * @param inputs Preview measurement input data
   * @returns Promise that resolves to measurement preview
   */
  async previewMeasurement(inputs: PreviewMeasurementFormOutput) {
    const { data } = await api.post<BaseResponse<Measurement>>('measurement/preview-measurement', inputs)
    return data.data
  }

  /**
   * Create a new measurement
   * @param inputs Create measurement input data
   * @returns Promise that resolves to created measurement
   */
  async createMeasurement(inputs: CreateMeasurementInput) {
    const { data } = await api.post<BaseResponse<Measurement>>('measurement/create-measurement', inputs)
    return data.data
  }
}

const diaryService = new DiaryService()
export default diaryService
