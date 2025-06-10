import { JWTPayload } from 'jose'

export interface BaseResponse<T> {
  data: T | null
  additionalData: Record<string, any> | null
  message: string | null
  statusCode: number
  code: string | null
}

export interface ErrorResponse {
  errorCode: string
  errorMessage: string
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
}

export interface JwtUser extends JWTPayload {
  email: string
  name: string
  role: string
  userId: string
  username: string
}

export interface CurrentUser {
  id: string
  userName: string | null
  userEmail: string
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
