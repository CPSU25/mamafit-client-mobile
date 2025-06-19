import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import diaryApi from '~/apis/diary.api'
import { ERROR_MESSAGES } from '~/lib/constants/constants'
import { initializeMeasurementsForm } from '../utils'
import {
  MeasurementsFormInput,
  measurementsFormOutput,
  MeasurementsFormOutput,
  PreviewMeasurementFormInput,
  previewMeasurementFormOutput,
  PreviewMeasurementFormOutput
} from '../validations'

const previewMeasurementDefaultValues: PreviewMeasurementFormInput = {
  measurementDiaryId: '',
  weight: '',
  bust: '',
  waist: '',
  hip: ''
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

export const useCreateMeasurement = (measurementDiaryId: string, onSuccess: () => void) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const previewMeasurementMethods = useForm<PreviewMeasurementFormInput, unknown, PreviewMeasurementFormOutput>({
    defaultValues: { ...previewMeasurementDefaultValues, measurementDiaryId },
    resolver: zodResolver(previewMeasurementFormOutput)
  })

  const measurementsMethods = useForm<MeasurementsFormInput, unknown, MeasurementsFormOutput>({
    defaultValues: defaultMeasurementsValues,
    resolver: zodResolver(measurementsFormOutput)
  })

  const previewMeasurementMutation = useMutation({
    mutationFn: diaryApi.previewMeasurement,
    onSuccess: (data) => {
      if (data) {
        initializeMeasurementsForm(data, measurementsMethods)
        onSuccess()
      }
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        previewMeasurementMethods.setError('root', {
          message: ERROR_MESSAGES.ALREADY_HAVE_MEASUREMENT
        })
      } else {
        previewMeasurementMethods.setError('root', {
          message: error.response?.data.errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG
        })
      }
    }
  })

  const createMeasurementMutation = useMutation({
    mutationFn: diaryApi.createMeasurement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-detail'] })
      queryClient.invalidateQueries({ queryKey: ['diaries'] })
      queryClient.invalidateQueries({ queryKey: ['week-of-pregnancy'] })
      router.back()
    }
  })

  return {
    previewMeasurementMethods,
    measurementsMethods,
    previewMeasurementMutation,
    createMeasurementMutation
  }
}
