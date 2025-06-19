import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import diaryApi from '~/apis/diary.api'
import { Measurement } from '~/types/diary.type'
import { initializeMeasurementsForm } from '../utils'
import { MeasurementsFormInput, measurementsFormOutput, MeasurementsFormOutput } from '../validations'

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

export const useEditMeasurementDetail = () => {
  const queryClient = useQueryClient()

  const methods = useForm<MeasurementsFormInput, unknown, MeasurementsFormOutput>({
    defaultValues: defaultMeasurementsValues,
    resolver: zodResolver(measurementsFormOutput)
  })

  const initForm = useCallback(
    (measurements: Measurement) => {
      initializeMeasurementsForm(measurements, methods)
    },
    [methods]
  )

  const editMeasurementDetailMutation = useMutation({
    mutationFn: diaryApi.editMeasurementDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-detail'] })
      queryClient.invalidateQueries({ queryKey: ['measurement-detail'] })
      queryClient.invalidateQueries({ queryKey: ['diaries'] })
      queryClient.invalidateQueries({ queryKey: ['week-of-pregnancy'] })
      router.back()
    }
  })

  return {
    methods,
    editMeasurementDetailMutation,
    initForm
  }
}
