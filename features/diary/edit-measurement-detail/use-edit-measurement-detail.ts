import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Measurement } from '~/types/diary.type'
import { MeasurementsFormInput, measurementsFormOutput, MeasurementsFormOutput } from '../create-diary/validations'

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
  const methods = useForm<MeasurementsFormInput, unknown, MeasurementsFormOutput>({
    defaultValues: defaultMeasurementsValues,
    resolver: zodResolver(measurementsFormOutput)
  })

  const initializeMeasurementsForm = useCallback(
    (measurements: Measurement) => {
      const formData: MeasurementsFormInput = {
        weekOfPregnancy: measurements.weekOfPregnancy.toString(),
        weight: measurements.weight.toFixed(1),
        bust: measurements.bust.toFixed(1),
        waist: measurements.waist.toFixed(1),
        hip: measurements.hip.toFixed(1),
        neck: measurements.neck.toFixed(1),
        coat: measurements.coat.toFixed(1),
        chestAround: measurements.chestAround.toFixed(1),
        shoulderWidth: measurements.shoulderWidth.toFixed(1),
        stomach: measurements.stomach.toFixed(1),
        pantsWaist: measurements.pantsWaist.toFixed(1),
        thigh: measurements.thigh.toFixed(1),
        legLength: measurements.legLength.toFixed(1),
        dressLength: measurements.dressLength.toFixed(1),
        sleeveLength: measurements.sleeveLength.toFixed(1)
      }

      methods.reset(formData)
    },
    [methods]
  )

  return {
    methods,
    initializeMeasurementsForm
  }
}
