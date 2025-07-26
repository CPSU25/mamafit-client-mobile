import { api } from '~/lib/axios/axios'
import { Appointment, BookAppointmentRequest, Slot } from '~/types/appointment.type'
import { BasePaginationResponse, BaseResponse } from '~/types/common'

class AppointmentService {
  async getAvailableSlots(branchId: string, date: string) {
    const { data } = await api.get<BaseResponse<Slot[]>>(`appointment/slot`, {
      params: {
        branchId,
        date
      }
    })

    return data.data
  }

  async bookAppointment(input: BookAppointmentRequest) {
    const { data } = await api.post<BaseResponse<string>>(`appointment`, input)

    return data.data
  }

  async getAppointments(page: number = 1, pageSize: number = 5, search?: string) {
    const { data } = await api.get<BasePaginationResponse<Appointment>>(`appointment/user`, {
      params: {
        page,
        pageSize,
        search,
        sortBy: 'UPCOMMING_AT_ASC'
      }
    })

    return data.data
  }
}

const appointmentService = new AppointmentService()
export default appointmentService
