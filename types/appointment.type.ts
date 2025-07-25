export interface Slot {
  slot: string[]
  isBooked: boolean
}

export interface BookAppointmentRequest {
  userId: string
  branchId: string
  bookingTime: string
  note: string
}
