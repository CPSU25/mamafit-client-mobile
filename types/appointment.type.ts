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

export interface Appointment {
  id: string
  user: {
    id: string
    userName: string
    userEmail: string
    phoneNumber: string
    dateOfBirth: string | null
    profilePicture: string | null
    fullName: string
    roleName: string
    isVerify: boolean
    createdAt: string
    createdBy: string | null
    updatedAt: string
    updatedBy: string | null
  }
  branch: {
    id: string
    branchManagerId: string
    name: string
    description: string
    openingHour: string
    closingHour: string
    images: string[]
    mapId: string
    province: string
    district: string
    ward: string
    street: string
    latitude: number
    longitude: number
  }
  bookingTime: string
  note: string
  status: string
  canceledAt: string | null
  canceledReason: string | null
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface AppointmentDetail {
  id: string
  user: {
    id: string
    userName: string
    userEmail: string
    phoneNumber: string
    dateOfBirth: string | null
    profilePicture: string | null
    fullName: string
    roleName: string
    isVerify: boolean
    createdAt: string
    createdBy: string | null
    updatedAt: string
    updatedBy: string | null
  }
  branch: {
    id: string
    branchManager: {
      id: string
      userName: string
      userEmail: string
      phoneNumber: string
      dateOfBirth: string | null
      profilePicture: string | null
      fullName: string
      roleName: string
      isVerify: boolean
      createdAt: string
      createdBy: string | null
      updatedAt: string
      updatedBy: string | null
    }
    name: string
    description: string
    openingHour: string
    closingHour: string
    images: string[]
    mapId: string
    province: string
    district: string
    ward: string
    street: string
    latitude: number
    longitude: number
  }
  bookingTime: string
  note: string
  status: string
  canceledAt: string | null
  canceledReason: string | null
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}
