import { UseFormReturn } from 'react-hook-form'
import { COLORS } from '~/lib/constants/svg-icon'
import { Measurement } from '~/types/diary.type'
import { MeasurementsFormInput, MeasurementsFormOutput } from './validations'

export const getIconColor = (currentStep: number, index: number): keyof typeof COLORS => {
  if (currentStep >= index) return 'PRIMARY'
  return 'GRAY'
}

export const initializeMeasurementsForm = (
  measurements: Measurement,
  methods: UseFormReturn<MeasurementsFormInput, unknown, MeasurementsFormOutput>
) => {
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
}
