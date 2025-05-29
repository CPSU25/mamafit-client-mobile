export interface BaseResponse<T> {
  data: T | null
  additionalData: Record<string, any> | null
  message: string | null
  statusCode: number
  code: string | null
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
}

export interface User {
  avatar: string | null
  createdBy: string | null
  createdDate: string | null
  dateOfBirth: string | null
  email: string
  fullName: string | null
  id: string
  isActive: boolean
  modifiedBy: string
  modifiedDate: string
  phoneNumber: string
  roleName: string | null
  username: string
}
