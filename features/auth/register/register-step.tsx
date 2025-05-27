import { Feather } from '@expo/vector-icons'
import { useEffect } from 'react'
import { Controller, FieldName, SubmitHandler } from 'react-hook-form'
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

export default function RegisterStep({ currentStep, setCurrentStep }: RegisterStepProps) {
  const { bottom } = useSafeAreaInsets()

  const {
    methods: {
      control,
      handleSubmit,
      trigger,
      watch,
      formState: { errors }
    }
  } = useRegister()
  const { timeLeft, isReady, start, reset: resetCountdown } = useCountDown({ seconds: 30, autoStart: false })
  const email = watch('email')

  const next = async () => {
    const fields = steps[currentStep - 1].field
    const output = await trigger(fields as FieldName<RegisterFormSchema>[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
      // TODO: Submit the form base on current step
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

  const onSubmit: SubmitHandler<RegisterFormSchema> = (data) => {
    console.log(data)
  }

  switch (currentStep) {
    case 2:
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
          <Button onPress={start} disabled={!isReady} style={{ paddingBottom: bottom }}>
            <Text className='font-inter-medium'>{isReady ? 'Send again' : `Resend in (${timeLeft}s)`} </Text>
          </Button>
        </View>
      )
    case 3:
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
                className={isFormError(errors, 'password') ? 'border-red-500' : ''}
              />
            )}
          />
          <View className='flex-1' />
          <Button onPress={handleSubmit(onSubmit)} style={{ paddingBottom: bottom }}>
            <Text className='font-inter-medium'>Create account</Text>
          </Button>
        </View>
      )
    default:
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
                className={isFormError(errors, 'phoneNumber') ? 'border-red-500' : ''}
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
                className={isFormError(errors, 'email') ? 'border-red-500' : ''}
              />
            )}
          />
          <View className='flex-1' />
          <Button onPress={next} style={{ paddingBottom: bottom }}>
            <Text className='font-inter-medium'>Continue</Text>
          </Button>
        </View>
      )
  }
}
