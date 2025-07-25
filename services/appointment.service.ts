import { api } from '~/lib/axios/axios'
import { BookAppointmentRequest, Slot } from '~/types/appointment.type'
import { BaseResponse } from '~/types/common'

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
}

const appointmentService = new AppointmentService()
export default appointmentService
