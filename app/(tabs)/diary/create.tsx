import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import FieldError from '~/components/field-error'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import PersonalInfoForm from '~/features/diary/create-diary/personal-info-form'
import PregnancyInfoForm from '~/features/diary/create-diary/pregnancy-info-form'
import { useCreateDiary } from '~/features/diary/create-diary/use-create-diary'
import { PersonalInfoFormSchema, PregnancyInfoFormSchema } from '~/features/diary/create-diary/validations'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

const steps = [
  { id: 1, name: 'Personal Information', field: ['name', 'weight', 'height', 'dateOfBirth'] },
  {
    id: 2,
    name: 'Pregnancy Information',
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
    ]
  },
  {
    id: 3,
    name: 'Your Measurements',
    field: []
  }
]

export default function MeasurementDiaryCreateScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const { bottom } = useSafeAreaInsets()
  const { stepOneMethods, stepTwoMethods } = useCreateDiary()

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

  const title = currentStep === 0 ? 'Step 1' : currentStep === 1 ? 'Step 2' : 'Step 3'

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row items-center justify-start p-4 relative'>
        <TouchableOpacity onPress={handleGoBack} className='absolute left-3 z-10'>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl text-center flex-1'>{title}</Text>
      </View>

      {currentStep === 0 && (
        <View className='flex-1 px-4'>
          <FormProvider {...stepOneMethods}>
            <PersonalInfoForm />
          </FormProvider>

          <View className='flex-1' />
          <View className='flex flex-col gap-4'>
            {stepOneRootMsg && <FieldError message={stepOneRootMsg} />}
            <Button style={{ marginBottom: bottom }} onPress={handleSubmitStepOne(onSubmitStepOne)}>
              <Text className='font-inter-medium'>Next</Text>
            </Button>
          </View>
        </View>
      )}
      {currentStep === 1 && (
        <View className='flex-1'>
          <FormProvider {...stepTwoMethods}>
            <PregnancyInfoForm />
          </FormProvider>

          <View className='flex-1' />
          <View className='flex flex-col gap-4 px-4'>
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
          </View>
        </View>
      )}
      {currentStep === 2 && <View className='flex-1'></View>}
    </SafeAreaView>
  )
}
