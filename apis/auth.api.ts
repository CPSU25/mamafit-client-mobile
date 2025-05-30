import { RegisterFormSchema } from '~/features/auth/register/validations'
import { SignInSchema } from '~/features/auth/sign-in/validations'
import { api } from '~/lib/axios/axios'
import { BaseResponse, SignInResponse } from '~/types/common'

const authApi = {
  sendCode: async ({ email, phoneNumber }: Pick<RegisterFormSchema, 'email' | 'phoneNumber'>) => {
    const { data } = await api.post<BaseResponse<null>>('user/send-otp', {
      email,
      phoneNumber
    })

    return data
  },
  resendCode: async ({ email, phoneNumber }: Pick<RegisterFormSchema, 'email' | 'phoneNumber'>) => {
    const { data } = await api.post<BaseResponse<null>>('user/resend-otp', {
      email,
      phoneNumber
    })

    return data
  },
  verifyCode: async ({ email, code }: Pick<RegisterFormSchema, 'email' | 'code'>) => {
    const { data } = await api.post<BaseResponse<null>>('auth/verify-otp', {
      email,
      code,
      otpType: 'REGISTER'
    })

    return data
  },
  completeRegister: async ({
    email,
    password,
    phoneNumber
  }: Pick<RegisterFormSchema, 'email' | 'password' | 'phoneNumber'>) => {
    const { data } = await api.post<BaseResponse<null>>('user/complete-register', {
      email,
      password,
      phoneNumber
    })

    return data
  },
  signIn: async ({ identifier, password, notificationToken }: SignInSchema & { notificationToken: string }) => {
    const { data } = await api.post<BaseResponse<SignInResponse>>('auth/signin', {
      identifier,
      password,
      notificationToken
    })

    return data
  },
  logout: async ({ refreshToken, notificationToken }: { refreshToken: string; notificationToken: string }) => {
    const { data } = await api.post<BaseResponse<null>>('auth/logout', {
      refreshToken,
      notificationToken
    })

    return data
  }
}

export default authApi
