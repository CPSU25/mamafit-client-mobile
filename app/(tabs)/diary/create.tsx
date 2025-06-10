import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import FieldError from '~/components/field-error'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import PersonalInfoForm from '~/features/diary/create-diary/personal-info-form'
import PregnancyInfoForm from '~/features/diary/create-diary/pregnancy-info-form'
import { useCreateDiary } from '~/features/diary/create-diary/use-create-diary'
import { PersonalInfoFormSchema, PregnancyInfoFormSchema } from '~/features/diary/create-diary/validations'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { COLORS, SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'

const steps = [
  {
    id: 1,
    name: 'Personal',
    field: ['name', 'weight', 'height', 'dateOfBirth'],
    icon: (color: keyof typeof COLORS) => SvgIcon.personalCard({ size: ICON_SIZE.SMALL, color })
  },
  {
    id: 2,
    name: 'Pregnancy',
    field: [
      'firstDateOfLastPeriod',
      'bust',
      'waist',
      'hip',
      'numberOfPregnancy',
      'averageMenstrualCycle',
      'ultrasoundDate',
      'weeksFromUltrasound',
      'dueDateFromUltrasound'
    ],
    icon: (color: keyof typeof COLORS) => SvgIcon.documentLike({ size: ICON_SIZE.SMALL, color })
  },
  {
    id: 3,
    name: 'Review',
    field: [],
    icon: (color: keyof typeof COLORS) => SvgIcon.personalCard({ size: ICON_SIZE.SMALL, color })
  }
]

export default function MeasurementDiaryCreateScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const { bottom } = useSafeAreaInsets()
  const { stepOneMethods, stepTwoMethods } = useCreateDiary()
  const { isDarkColorScheme } = useColorScheme()

  const {
    handleSubmit: handleSubmitStepOne,
    formState: { errors: stepOneErrors }
  } = stepOneMethods

  const {
    handleSubmit: handleSubmitStepTwo,
    formState: { errors: stepTwoErrors }
  } = stepTwoMethods

  const stepOneRootMsg =
    stepOneErrors.root?.message || (stepOneErrors as any)['']?.message || (stepOneErrors as any)._errors?.[0]

  const stepTwoRootMsg =
    stepTwoErrors.root?.message || (stepTwoErrors as any)['']?.message || (stepTwoErrors as any)._errors?.[0]

  const next = () => {
    setCurrentStep((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1
      }
      return prev
    })
  }

  const prev = () => {
    setCurrentStep((prev) => {
      if (prev > 0) {
        return prev - 1
      }
      return prev
    })
  }

  const handleGoBack = () => {
    router.back()
  }

  const onSubmitStepOne: SubmitHandler<PersonalInfoFormSchema> = (data) => {
    console.log('Personal Information:', data)
    next()
  }

  const onSubmitStepTwo: SubmitHandler<PregnancyInfoFormSchema> = (data) => {
    console.log('Pregnancy Information:', data)
    next()
  }

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${((currentStep + 1) / steps.length) * 100}%`, {
        damping: 15,
        stiffness: 100
      })
    }
  })

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row items-center justify-start p-4 relative'>
        <TouchableOpacity onPress={handleGoBack} className='absolute left-3 z-10'>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl text-center flex-1'>Create New Diary</Text>
      </View>

      {/* Progress Bar */}
      <View className='px-4'>
        <View className='h-2 bg-muted/50 rounded-full overflow-hidden'>
          <Animated.View
            className={cn('h-full rounded-full', isDarkColorScheme ? 'bg-primary' : 'bg-primary')}
            style={progressStyle}
          />
        </View>
        <View className='flex flex-row justify-between items-center mt-4'>
          {steps.map((step, index) => (
            <View key={step.id} className='items-center'>
              {step.icon(index <= currentStep ? 'PRIMARY' : 'GRAY')}
            </View>
          ))}
        </View>
      </View>

      {currentStep === 0 && (
        <View className='flex-1 mt-6'>
          <View className='flex-1 px-4'>
            <FormProvider {...stepOneMethods}>
              <PersonalInfoForm />
            </FormProvider>

            <View className='flex-1' />
            <Animated.View
              entering={SlideInLeft.duration(250)}
              exiting={SlideOutLeft.duration(250)}
              className='flex flex-col gap-2'
            >
              {stepOneRootMsg && <FieldError message={stepOneRootMsg} />}
              <Button style={{ marginBottom: bottom }} onPress={handleSubmitStepOne(onSubmitStepOne)}>
                <Text className='font-inter-medium'>Next</Text>
              </Button>
            </Animated.View>
          </View>
        </View>
      )}
      {currentStep === 1 && (
        <View className='flex-1 mt-4'>
          <FormProvider {...stepTwoMethods}>
            <PregnancyInfoForm />
          </FormProvider>

          <View className='flex-1' />
          <Animated.View
            entering={SlideInRight.duration(250)}
            exiting={SlideOutRight.duration(250)}
            className='flex flex-col gap-4 px-4'
          >
            {stepTwoRootMsg && <FieldError message={stepTwoRootMsg} />}
            <View className='flex flex-row gap-2'>
              <Button className='flex-1' variant='outline' style={{ marginBottom: bottom }} onPress={prev}>
                <Text className='font-inter-medium'>Previous</Text>
              </Button>
              <Button
                className='flex-1'
                style={{ marginBottom: bottom }}
                onPress={handleSubmitStepTwo(onSubmitStepTwo)}
              >
                <Text className='font-inter-medium'>Next</Text>
              </Button>
            </View>
          </Animated.View>
        </View>
      )}
      {currentStep === 2 && (
        <View className='flex-1 px-4'>
          <View className='flex-1'></View>
        </View>
      )}
    </SafeAreaView>
  )
}
