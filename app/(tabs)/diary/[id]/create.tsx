import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeOutDown, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import FieldError from '~/components/field-error'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import PreviewMeasurementForm from '~/features/diary/components/forms/preview-measurement-form'
import ReviewMeasurementsForm from '~/features/diary/components/forms/review-measurements-form'
import { useCreateMeasurement } from '~/features/diary/hooks/use-create-measurement'
import { getIconColor } from '~/features/diary/utils'
import { MeasurementsFormOutput, PreviewMeasurementFormOutput } from '~/features/diary/validations'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { COLORS, SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'

// Steps for the measurement creation process
const steps = [
  {
    id: 1,
    name: 'Personal Information',
    icon: (color: keyof typeof COLORS) => SvgIcon.folderAdd({ size: ICON_SIZE.SMALL, color })
  },
  {
    id: 2,
    name: 'Review Measurements',
    icon: (color: keyof typeof COLORS) => SvgIcon.chartSuccess({ size: ICON_SIZE.SMALL, color })
  }
]

export default function CreateMeasurementScreen() {
  const router = useRouter()

  const { id } = useLocalSearchParams() as { id: string }
  const [currentStep, setCurrentStep] = useState(0)
  const { isDarkColorScheme } = useColorScheme()

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

  const { previewMeasurementMethods, measurementsMethods, previewMeasurementMutation, createMeasurementMutation } =
    useCreateMeasurement(id, next)

  const {
    handleSubmit: handlePreviewMeasurement,
    formState: { errors: stepOneErrors }
  } = previewMeasurementMethods
  const {
    handleSubmit: handleSubmitMeasurement,
    formState: { errors: stepTwoErrors }
  } = measurementsMethods

  const stepOneRootMsg =
    stepOneErrors.root?.message || (stepOneErrors as any)['']?.message || (stepOneErrors as any)._errors?.[0]

  const stepTwoRootMsg =
    stepTwoErrors.root?.message || (stepTwoErrors as any)['']?.message || (stepTwoErrors as any)._errors?.[0]

  // Progress Bar Animations
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

  // Step Icons Animations
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

  // Step Icons Styles
  const stepIconStyles = [stepIconStyle0, stepIconStyle1]

  const handleGoBack = () => {
    router.back()
  }

  const onSubmitStepOne: SubmitHandler<PreviewMeasurementFormOutput> = (data) => {
    previewMeasurementMutation.mutate(data)
  }

  const onSubmitStepTwo: SubmitHandler<MeasurementsFormOutput> = (data) => {
    createMeasurementMutation.mutate({
      ...data,
      measurementDiaryId: id
    })
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row items-center justify-start p-4 relative'>
        <TouchableOpacity onPress={handleGoBack} className='absolute left-3 z-10'>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl text-center flex-1'>Add Measurement</Text>
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
        </View>
      </View>

      {currentStep === 0 && (
        <View className='flex-1 mt-6 px-4'>
          <FormProvider {...previewMeasurementMethods}>
            <PreviewMeasurementForm />
          </FormProvider>

          <View className='flex-1' />

          <Animated.View entering={FadeInDown.duration(250)} exiting={FadeOutDown.duration(250)} className='gap-2'>
            {stepOneRootMsg && <FieldError message={stepOneRootMsg} />}
            <Button onPress={handlePreviewMeasurement(onSubmitStepOne)} disabled={previewMeasurementMutation.isPending}>
              <Text className='font-inter-medium'>
                {previewMeasurementMutation.isPending ? 'Calculating...' : 'Next'}
              </Text>
            </Button>
          </Animated.View>
        </View>
      )}

      {currentStep === 1 && (
        <View className='flex-1'>
          <FormProvider {...measurementsMethods}>
            <ReviewMeasurementsForm />
          </FormProvider>
          <View className='flex-1' />
          <Animated.View
            entering={FadeInDown.duration(250)}
            exiting={FadeOutDown.duration(250)}
            className='flex flex-col gap-2 px-4'
          >
            {stepTwoRootMsg && <FieldError message={stepTwoRootMsg} />}
            <View className='flex flex-row gap-2'>
              <Button className='flex-1' variant='outline' onPress={prev}>
                <Text className='font-inter-medium'>Previous</Text>
              </Button>
              <Button
                className='flex-1'
                onPress={handleSubmitMeasurement(onSubmitStepTwo)}
                disabled={createMeasurementMutation.isPending}
              >
                <Text className='font-inter-medium'>
                  {createMeasurementMutation.isPending ? 'Submitting...' : 'Submit'}
                </Text>
              </Button>
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  )
}
