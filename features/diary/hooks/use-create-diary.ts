import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import diaryService from '~/services/diary.service'
import { initializeMeasurementsForm } from '../utils'
import {
  MeasurementsFormInput,
  MeasurementsFormOutput,
  measurementsFormOutput,
  PersonalInfoFormInput,
  PersonalInfoFormOutput,
  personalInfoFormOutput,
  PregnancyInfoFormInput,
  PregnancyInfoFormOutput,
  pregnancyInfoFormOutput
} from '../validations'

const defaultValuesStepOne: PersonalInfoFormInput = {
  name: '',
  weight: '',
  height: '',
  age: ''
}

const defaultValuesStepTwo: PregnancyInfoFormInput = {
  firstDateOfLastPeriod: '',
  bust: '',
  waist: '',
  hip: '',
  numberOfPregnancy: '',
  averageMenstrualCycle: '',
  ultrasoundDate: null,
  weeksFromUltrasound: ''
  // dueDateFromUltrasound: null
}

const defaultMeasurementsValues: MeasurementsFormInput = {
  weekOfPregnancy: '0',
  weight: '0',
  bust: '0',
  waist: '0',
  hip: '0',
  neck: '0',
  coat: '0',
  chestAround: '0',
  shoulderWidth: '0',
  stomach: '0',
  pantsWaist: '0',
  thigh: '0',
  legLength: '0',
  dressLength: '0',
  sleeveLength: '0'
}

export const useCreateDiary = (onSuccess: () => void, onFinish: () => void, redirectTo: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Form methods
  const stepOneMethods = useForm<PersonalInfoFormInput, unknown, PersonalInfoFormOutput>({
    defaultValues: defaultValuesStepOne,
    resolver: zodResolver(personalInfoFormOutput)
  })
  const stepTwoMethods = useForm<PregnancyInfoFormInput, unknown, PregnancyInfoFormOutput>({
    defaultValues: defaultValuesStepTwo,
    resolver: zodResolver(pregnancyInfoFormOutput)
  })
  const measurementsMethods = useForm<MeasurementsFormInput, unknown, MeasurementsFormOutput>({
    defaultValues: defaultMeasurementsValues,
    resolver: zodResolver(measurementsFormOutput)
  })

  // Mutations
  const previewDiaryMutation = useMutation({
    mutationFn: diaryService.previewDiary,
    onSuccess: (measurement) => {
      if (measurement) {
        initializeMeasurementsForm(measurement, measurementsMethods)
        onSuccess()
      }
    },
    onError: (error) => {
      stepTwoMethods.setError('root', {
        message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG
      })
    }
  })

  const createDiaryMutation = useMutation({
    mutationFn: diaryService.createDiary,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['diaries'] })
        queryClient.invalidateQueries({ queryKey: ['all-diaries'] })
        queryClient.invalidateQueries({ queryKey: ['all-diaries-queries'] })
        if (redirectTo) {
          router.replace(redirectTo as any)
        } else {
          router.replace(`/diary/${data.diaryId}/detail`)
        }

        setTimeout(() => {
          stepOneMethods.reset()
          stepTwoMethods.reset()
          measurementsMethods.reset()
          onFinish()
        }, 500)
      }
    },
    onError: (error) => {
      measurementsMethods.setError('root', {
        message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG
      })
    }
  })

  return {
    stepOneMethods,
    stepTwoMethods,
    measurementsMethods,
    previewDiaryMutation,
    createDiaryMutation
  }
}
