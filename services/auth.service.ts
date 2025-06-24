import { RegisterFormSchema, SignInSchema } from '~/features/auth/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse, Permission, SignInResponse } from '~/types/common'

class AuthService {
  /**
   * Send OTP code for registration
   * @param email User's email
   * @param phoneNumber User's phone number
   * @returns Promise that resolves to base response
   */
  async sendCode({ email, phoneNumber }: Pick<RegisterFormSchema, 'email' | 'phoneNumber'>) {
    const { data } = await api.post<BaseResponse<null>>('auth/send-otp', {
      email,
      phoneNumber
    })
    return data
  }

  /**
   * Resend OTP code for registration
   * @param email User's email
   * @param phoneNumber User's phone number
   * @returns Promise that resolves to base response
   */
  async resendCode({ email, phoneNumber }: Pick<RegisterFormSchema, 'email' | 'phoneNumber'>) {
    const { data } = await api.post<BaseResponse<null>>('auth/resend-otp', {
      email,
      phoneNumber
    })
    return data
  }

  /**
   * Verify OTP code for registration
   * @param email User's email
   * @param code OTP code
   * @returns Promise that resolves to base response
   */
  async verifyCode({ email, code }: Pick<RegisterFormSchema, 'email' | 'code'>) {
    const { data } = await api.post<BaseResponse<null>>('auth/verify-otp', {
      email,
      code,
      otpType: 'REGISTER'
    })
    return data
  }

  /**
   * Complete user registration
   * @param email User's email
   * @param password User's password
   * @param phoneNumber User's phone number
   * @returns Promise that resolves to base response
   */
  async completeRegister({
    email,
    password,
    phoneNumber
  }: Pick<RegisterFormSchema, 'email' | 'password' | 'phoneNumber'>) {
    const { data } = await api.post<BaseResponse<null>>('auth/complete-register', {
      email,
      password,
      phoneNumber
    })
    return data
  }

  /**
   * Sign in user with credentials
   * @param identifier User's email or phone number
   * @param password User's password
   * @param notificationToken Push notification token
   * @returns Promise that resolves to sign in response
   */
  async signIn({ identifier, password, notificationToken }: SignInSchema & { notificationToken: string }) {
    const { data } = await api.post<BaseResponse<SignInResponse>>('auth/signin', {
      identifier,
      password,
      notificationToken
    })
    return data
  }

  /**
   * Sign in user with Google
   * @param jwtToken Google JWT token
   * @param notificationToken Push notification token
   * @returns Promise that resolves to sign in response
   */
  async signInWithGoogle({ jwtToken, notificationToken }: { jwtToken: string; notificationToken: string }) {
    const { data } = await api.post<BaseResponse<SignInResponse>>('auth/login-google', {
      jwtToken,
      notificationToken
    })
    return data
  }

  /**
   * Logout user
   * @param refreshToken User's refresh token
   * @param notificationToken Push notification token
   * @returns Promise that resolves to base response
   */
  async logout({ refreshToken, notificationToken }: { refreshToken: string; notificationToken: string }) {
    const { data } = await api.post<BaseResponse<null>>('auth/logout', {
      refreshToken,
      notificationToken
    })
    return data
  }

  /**
   * Get current user permissions
   * @returns Promise that resolves to user permissions
   */
  async getCurrentUser() {
    const { data } = await api.get<BaseResponse<Permission>>('auth/permission')
    return data.data
  }

  /**
   * Refresh authentication token
   * @param refreshToken Current refresh token
   * @returns Promise that resolves to new auth tokens
   */
  async refreshToken(refreshToken: string) {
    const { data } = await api.post<BaseResponse<SignInResponse>>('auth/refresh', {
      refreshToken
    })
    return data
  }
}

const authService = new AuthService()
export default authService
