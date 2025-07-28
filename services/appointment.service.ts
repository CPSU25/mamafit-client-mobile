import { api } from '~/lib/axios/axios'
import { Appointment, AppointmentDetail, BookAppointmentRequest, Slot } from '~/types/appointment.type'
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

  async getAppointment(appointmentId: string) {
    const { data } = await api.get<BaseResponse<AppointmentDetail>>(`appointment/${appointmentId}`)

    return data.data
  }

  async cancelAppointment({ appointmentId, reason }: { appointmentId: string; reason: string }) {
    const { data } = await api.put<BaseResponse<string>>(`appointment/${appointmentId}/cancel`, reason)

    return data.data
  }
}

const appointmentService = new AppointmentService()
export default appointmentService
