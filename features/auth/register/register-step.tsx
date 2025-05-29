import FieldError from '~/components/field-error'
import { Feather } from '@expo/vector-icons'
import { useEffect } from 'react'
import {
  Control,
  Controller,
  FieldErrors,
  FieldName,
  SubmitHandler,
  UseFormHandleSubmit,
  useWatch
} from 'react-hook-form'
import { AppState, View } from 'react-native'
import { OtpInput } from 'react-native-otp-entry'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useCountDown } from '~/hooks/use-count-down'
import { PRIMARY_COLOR } from '~/lib/constants'
import { isFormError } from '~/lib/utils'
import { useRegister } from './use-register'
import { RegisterFormSchema } from './validations'

interface RegisterStepProps {
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  setTabValue: React.Dispatch<React.SetStateAction<string>>
}

export const steps = [
  { id: 1, name: 'Email', field: ['email', 'phoneNumber'] },
  {
    id: 2,
    name: 'Code verification',
    field: ['code']
  },
  {
    id: 3,
    name: 'Password',
    field: ['password']
  }
]

export default function RegisterStep({ currentStep, setCurrentStep, setTabValue }: RegisterStepProps) {
  const { bottom } = useSafeAreaInsets()

  const {
    methods: {
      control,
      handleSubmit,
      trigger,
      getValues,
      formState: { errors }
    },
    sendCodeMutation: { mutate: sendCode, isPending: isSendingCode, isError: isSendCodeError },
    resendCodeMutation: { mutateAsync: resendCode },
    verifyCodeMutation: { mutate: verifyCode, isPending: isVerifyingCode },
    completeRegisterMutation: { mutate: completeRegister, isPending: isCompletingRegister }
  } = useRegister({
    onRegisterSuccess: () => {
      if (currentStep === 3) {
        setCurrentStep(1)
        setTabValue('sign-in')
      } else {
        setCurrentStep((prev) => prev + 1)
      }
    }
  })
  const { timeLeft, isReady, start, reset: resetCountdown } = useCountDown({ seconds: 30, autoStart: false })
  const email = useWatch({ control, name: 'email' })

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && currentStep === 2) {
        resetCountdown()
        start()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [currentStep, resetCountdown, start])

  useEffect(() => {
    if (currentStep === 2) {
      resetCountdown()
      start()
    } else {
      resetCountdown()
    }
  }, [currentStep, resetCountdown, start])

  useEffect(() => {
    if (!email) {
      setCurrentStep(1)
    }
  }, [email, setCurrentStep])

  const next = async () => {
    const fields = steps[currentStep - 1].field
    const output = await trigger(fields as FieldName<RegisterFormSchema>[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length) {
      if (currentStep === 1) {
        sendCode({ email, phoneNumber: getValues('phoneNumber') })
      } else if (currentStep === 2) {
        verifyCode({ email, code: getValues('code') })
      }
    }
  }

  const prev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      if (currentStep === 2) {
        resetCountdown()
      }
    }
  }

  const onSubmit: SubmitHandler<RegisterFormSchema> = (data) => {
    completeRegister({ email, password: data.password, phoneNumber: data.phoneNumber })
  }

  const handleResendCode = async () => {
    await resendCode({ email, phoneNumber: getValues('phoneNumber') })
    start()
  }

  switch (currentStep) {
    case 1:
      return (
        <SendCode
          control={control}
          errors={errors}
          isSendCodeError={isSendCodeError}
          isSendingCode={isSendingCode}
          next={next}
          bottom={bottom}
        />
      )
    case 2:
      return (
        <VerifyCode
          control={control}
          isVerifyingCode={isVerifyingCode}
          next={next}
          prev={prev}
          bottom={bottom}
          email={email}
          handleResendCode={handleResendCode}
          isReady={isReady}
          timeLeft={timeLeft}
        />
      )
    case 3:
      return (
        <CreatePassword
          control={control}
          errors={errors}
          bottom={bottom}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isCompletingRegister={isCompletingRegister}
        />
      )
    default:
      return (
        <View>
          <Text>Something went wrong</Text>
        </View>
      )
  }
}

// Step 1: Send code
interface SendCodeProps {
  control: Control<RegisterFormSchema>
  errors: FieldErrors<RegisterFormSchema>
  isSendCodeError: boolean
  isSendingCode: boolean
  next: () => void
  bottom: number
}

function SendCode({ control, errors, isSendCodeError, isSendingCode, next, bottom }: SendCodeProps) {
  return (
    <View className='flex-1 flex flex-col gap-4 mt-6'>
      <Controller
        control={control}
        name='phoneNumber'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            {...field}
            value={value}
            onChangeText={onChange}
            placeholder='Phone number'
            keyboardType='phone-pad'
            StartIcon={<Feather name='phone' size={20} color={PRIMARY_COLOR.LIGHT} />}
            autoFocus
            spellCheck={false}
            className={isFormError(errors, 'phoneNumber') ? 'border-rose-500' : ''}
          />
        )}
      />
      <Controller
        control={control}
        name='email'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            {...field}
            value={value}
            onChangeText={onChange}
            placeholder='Email'
            StartIcon={<Feather name='mail' size={20} color={PRIMARY_COLOR.LIGHT} />}
            spellCheck={false}
            className={isFormError(errors, 'email') ? 'border-rose-500' : ''}
          />
        )}
      />
      <View className='flex flex-col gap-1.5'>
        {isFormError(errors, 'phoneNumber') && <FieldError message={errors.phoneNumber?.message || ''} />}
        {isFormError(errors, 'email') && <FieldError message={errors.email?.message || ''} />}
      </View>
      <View className='flex-1' />
      <Button onPress={next} disabled={isSendingCode} style={{ marginBottom: bottom }}>
        <Text className='font-inter-medium'>{isSendingCode ? 'Sending...' : 'Continue'}</Text>
      </Button>
    </View>
  )
}

// Step 2: Verify code
interface VerifyCodeProps {
  control: Control<RegisterFormSchema>
  isVerifyingCode: boolean
  next: () => void
  prev: () => void
  handleResendCode: () => void
  bottom: number
  email: string
  isReady: boolean
  timeLeft: number
}

function VerifyCode({
  control,
  isVerifyingCode,
  next,
  bottom,
  email,
  prev,
  handleResendCode,
  isReady,
  timeLeft
}: VerifyCodeProps) {
  return (
    <View className='flex-1 flex flex-col mt-6'>
      <Text className='text-center mb-4'>We have just sent 6-digit code to {email}, enter it below:</Text>
      <Controller
        control={control}
        name='code'
        render={({ field }) => (
          <OtpInput
            numberOfDigits={6}
            onTextChange={field.onChange}
            onFilled={next}
            focusColor={PRIMARY_COLOR.LIGHT}
            autoFocus
            hideStick
            blurOnFilled
            type='numeric'
            secureTextEntry={false}
            focusStickBlinkingDuration={500}
            textInputProps={{
              accessibilityLabel: 'One-Time Password'
            }}
            textProps={{
              accessibilityRole: 'text',
              accessibilityLabel: 'OTP digit',
              allowFontScaling: false
            }}
            theme={{
              containerStyle: {
                paddingHorizontal: 40
              },
              pinCodeContainerStyle: {
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 2,
                width: 36,
                borderBottomColor: PRIMARY_COLOR.LIGHT,
                borderRadius: 0
              },
              pinCodeTextStyle: {
                color: PRIMARY_COLOR.LIGHT,
                fontFamily: 'Inter-Bold',
                fontSize: 30
              }
            }}
          />
        )}
      />
      <Text className='text-center mt-8' onPress={prev}>
        Wrong email? <Text className='text-primary font-inter-semibold'>Send to different email</Text>
      </Text>
      <View className='flex-1' />
      <Button onPress={handleResendCode} disabled={!isReady || isVerifyingCode} style={{ marginBottom: bottom }}>
        <Text className='font-inter-medium'>{isReady ? 'Send again' : `Resend in (${timeLeft}s)`} </Text>
      </Button>
    </View>
  )
}

// Step 3: Create password
interface CreatePasswordProps {
  control: Control<RegisterFormSchema>
  errors: FieldErrors<RegisterFormSchema>
  bottom: number
  handleSubmit: UseFormHandleSubmit<RegisterFormSchema>
  onSubmit: SubmitHandler<RegisterFormSchema>
  isCompletingRegister: boolean
}

function CreatePassword({
  control,
  errors,
  bottom,
  handleSubmit,
  onSubmit,
  isCompletingRegister
}: CreatePasswordProps) {
  return (
    <View className='flex-1 flex flex-col gap-4 mt-6'>
      <Controller
        control={control}
        name='password'
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            {...field}
            value={value}
            onChangeText={onChange}
            placeholder='Enter your password'
            StartIcon={<Feather name='lock' size={20} color={PRIMARY_COLOR.LIGHT} />}
            autoFocus
            spellCheck={false}
            secureTextEntry
            className={isFormError(errors, 'password') ? 'border-rose-500' : ''}
          />
        )}
      />
      <FieldError message={errors.password?.message || ''} />
      <View className='flex-1' />
      <Button onPress={handleSubmit(onSubmit)} disabled={isCompletingRegister} style={{ marginBottom: bottom }}>
        <Text className='font-inter-medium'>{isCompletingRegister ? 'Creating...' : 'Create account'}</Text>
      </Button>
    </View>
  )
}
