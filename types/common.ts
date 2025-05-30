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

export interface CurrentUser {
  id: string
  username: string | null
  email: string
  phoneNumber: string | null
  dateOfBirth: null
  profilePicture: string | null
  fullName: string | null
  roleName: string
  isVerify: boolean
  createdAt: string
  createdBy: string | null
  updatedAt: string
  updatedBy: string | null
}
