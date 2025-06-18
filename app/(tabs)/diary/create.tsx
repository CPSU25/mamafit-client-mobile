import { Feather } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeOutDown, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import FieldError from '~/components/field-error'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import PersonalInfoForm from '~/features/diary/create-diary/personal-info-form'
import PregnancyInfoForm from '~/features/diary/create-diary/pregnancy-info-form'
import ReviewMeasurements from '~/features/diary/create-diary/review-measurements'
import { useCreateDiary } from '~/features/diary/create-diary/use-create-diary'
import {
  MeasurementsFormOutput,
  personalInfoFormOutput,
  PersonalInfoFormOutput,
  pregnancyInfoFormOutput,
  PregnancyInfoFormOutput
} from '~/features/diary/create-diary/validations'
import { useAuth } from '~/hooks/use-auth'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { COLORS, SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'

const steps = [
  {
    id: 1,
    name: 'Personal',
    field: ['name', 'weight', 'height', 'age'],
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
      'weeksFromUltrasound'
      // 'dueDateFromUltrasound'
    ],
    icon: (color: keyof typeof COLORS) => SvgIcon.folderFavorite({ size: ICON_SIZE.SMALL, color })
  },
  {
    id: 3,
    name: 'Review',
    field: [],
    icon: (color: keyof typeof COLORS) => SvgIcon.chartSuccess({ size: ICON_SIZE.SMALL, color })
  }
]

const getIconColor = (currentStep: number, index: number): keyof typeof COLORS => {
  if (currentStep >= index) return 'PRIMARY'
  return 'GRAY'
}

export default function DiaryCreateScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const queryClient = useQueryClient()

  const {
    stepOneMethods,
    stepTwoMethods,
    measurementsMethods,
    initializeMeasurementsForm,
    previewDiaryMutation,
    createDiaryMutation
  } = useCreateDiary()
  const { isDarkColorScheme } = useColorScheme()

  const {
    handleSubmit: handleSubmitStepOne,
    formState: { errors: stepOneErrors },
    getValues: getStepOneValues
  } = stepOneMethods

  const {
    handleSubmit: handleSubmitStepTwo,
    formState: { errors: stepTwoErrors },
    getValues: getStepTwoValues
  } = stepTwoMethods

  const {
    handleSubmit: handleSubmitMeasurements,
    formState: { errors: measurementsErrors }
  } = measurementsMethods

  const stepOneRootMsg =
    stepOneErrors.root?.message || (stepOneErrors as any)['']?.message || (stepOneErrors as any)._errors?.[0]

  const stepTwoRootMsg =
    stepTwoErrors.root?.message || (stepTwoErrors as any)['']?.message || (stepTwoErrors as any)._errors?.[0]

  const measurementsRootMsg =
    measurementsErrors.root?.message ||
    (measurementsErrors as any)['']?.message ||
    (measurementsErrors as any)._errors?.[0]

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

  const onSubmitStepOne: SubmitHandler<PersonalInfoFormOutput> = (data) => {
    console.log('Personal Information:', data)
    next()
  }

  const onSubmitStepTwo: SubmitHandler<PregnancyInfoFormOutput> = (data) => {
    console.log('Pregnancy Information:', data)
    const parsedStepOneValues = personalInfoFormOutput.parse(getStepOneValues())

    previewDiaryMutation
      .mutateAsync({
        ...data,
        ...parsedStepOneValues
      })
      .then((measurements) => {
        if (measurements) {
          initializeMeasurementsForm(measurements)
        }
        next()
      })
      .catch((error) => {
        console.error('Failed to preview diary:', error)
      })
  }

  const onSubmitStepThree: SubmitHandler<MeasurementsFormOutput> = (measurementsData) => {
    const parsedStepOneValues = personalInfoFormOutput.parse(getStepOneValues())
    const parsedStepTwoValues = pregnancyInfoFormOutput.parse(getStepTwoValues())

    createDiaryMutation
      .mutateAsync({
        diary: {
          ...parsedStepOneValues,
          ...parsedStepTwoValues
        },
        measurement: measurementsData
      })
      .then((data) => {
        if (data) {
          router.replace(`/diary/${data.diaryId}/detail`)
          setTimeout(() => {
            handleReset()
          }, 500)
          queryClient.invalidateQueries({ queryKey: ['diaries', user?.userId] })
        }
      })
  }

  const handleReset = () => {
    stepOneMethods.reset()
    stepTwoMethods.reset()
    measurementsMethods.reset()
    setCurrentStep(0)
  }

  const progressBar1Style = useAnimatedStyle(() => {
    let progress = 0
    if (currentStep === 0) progress = 0.5
    else if (currentStep >= 1) progress = 1

    return {
      transform: [
        {
          scaleX: withSpring(progress, {
            damping: 20,
            stiffness: 120,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01
          })
        }
      ],
      transformOrigin: 'left'
    }
  })

  const progressBar2Style = useAnimatedStyle(() => {
    let progress = 0
    if (currentStep === 1) progress = 0.5
    else if (currentStep >= 2) progress = 1

    return {
      transform: [
        {
          scaleX: withSpring(progress, {
            damping: 20,
            stiffness: 120,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01
          })
        }
      ],
      transformOrigin: 'left'
    }
  })

  const stepIconStyle0 = useAnimatedStyle(() => {
    const scale = currentStep === 0 ? 1.3 : 0.9

    return {
      transform: [
        {
          scale: withSpring(scale, {
            damping: 20,
            stiffness: 120,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01
          })
        }
      ]
    }
  })

  const stepIconStyle1 = useAnimatedStyle(() => {
    const scale = currentStep === 1 ? 1.3 : 0.9

    return {
      transform: [
        {
          scale: withSpring(scale, {
            damping: 20,
            stiffness: 120,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01
          })
        }
      ]
    }
  })

  const stepIconStyle2 = useAnimatedStyle(() => {
    const scale = currentStep === 2 ? 1.3 : 0.9

    return {
      transform: [
        {
          scale: withSpring(scale, {
            damping: 20,
            stiffness: 120,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01
          })
        }
      ]
    }
  })

  const stepIconStyles = [stepIconStyle0, stepIconStyle1, stepIconStyle2]

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row items-center justify-start p-4 relative'>
        <TouchableOpacity onPress={handleGoBack} className='absolute left-3 z-10'>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl text-center flex-1'>Create New Diary</Text>
      </View>

      <View className='px-4'>
        <View className='flex flex-row items-center justify-between'>
          <Animated.View className='mx-1' style={stepIconStyles[0]}>
            {steps[0].icon(getIconColor(currentStep, 0))}
          </Animated.View>

          <View className='flex-1 mx-3 h-1.5 bg-muted/50 rounded-full overflow-hidden'>
            <Animated.View
              className={cn('h-full w-full rounded-full', isDarkColorScheme ? 'bg-primary' : 'bg-primary')}
              style={progressBar1Style}
            />
          </View>

          <Animated.View className='mx-1' style={stepIconStyles[1]}>
            {steps[1].icon(getIconColor(currentStep, 1))}
          </Animated.View>

          <View className='flex-1 mx-3 h-1.5 bg-muted/50 rounded-full overflow-hidden'>
            <Animated.View
              className={cn('h-full w-full rounded-full', isDarkColorScheme ? 'bg-primary' : 'bg-primary')}
              style={progressBar2Style}
            />
          </View>

          <Animated.View className='mx-1' style={stepIconStyles[2]}>
            {steps[2].icon(getIconColor(currentStep, 2))}
          </Animated.View>
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
              entering={FadeInDown.duration(250)}
              exiting={FadeOutDown.duration(250)}
              className='flex flex-col gap-2'
            >
              {stepOneRootMsg && <FieldError message={stepOneRootMsg} />}
              <Button onPress={handleSubmitStepOne(onSubmitStepOne)}>
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
            entering={FadeInDown.duration(250)}
            exiting={FadeOutDown.duration(250)}
            className='flex flex-col gap-4 px-4'
          >
            {stepTwoRootMsg && <FieldError message={stepTwoRootMsg} />}
            <View className='flex flex-row gap-2'>
              <Button className='flex-1' variant='outline' onPress={prev}>
                <Text className='font-inter-medium'>Previous</Text>
              </Button>
              <Button
                className='flex-1'
                onPress={handleSubmitStepTwo(onSubmitStepTwo)}
                disabled={previewDiaryMutation.isPending}
              >
                <Text className='font-inter-medium'>{previewDiaryMutation.isPending ? 'Calculating...' : 'Next'}</Text>
              </Button>
            </View>
          </Animated.View>
        </View>
      )}
      {currentStep === 2 && (
        <View className='flex-1'>
          <FormProvider {...measurementsMethods}>
            <ReviewMeasurements />
          </FormProvider>
          <View className='flex-1' />
          <Animated.View
            entering={FadeInDown.duration(250)}
            exiting={FadeOutDown.duration(250)}
            className='flex flex-col gap-2 px-4'
          >
            {measurementsRootMsg && <FieldError message={measurementsRootMsg} />}
            <View className='flex flex-row gap-2'>
              <Button className='flex-1' variant='outline' onPress={prev}>
                <Text className='font-inter-medium'>Previous</Text>
              </Button>
              <Button
                className='flex-1'
                onPress={handleSubmitMeasurements(onSubmitStepThree)}
                disabled={createDiaryMutation.isPending}
              >
                <Text className='font-inter-medium'>{createDiaryMutation.isPending ? 'Submitting...' : 'Submit'}</Text>
              </Button>
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  )
}
