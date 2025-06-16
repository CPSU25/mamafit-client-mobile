import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import diaryApi from '~/apis/diary.api'
import { PreviewDiaryResponse } from '~/types/diary.type'
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
} from './validations'

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

export const useCreateDiary = () => {
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
    mutationFn: diaryApi.previewDiary
  })
  const createDiaryMutation = useMutation({
    mutationFn: diaryApi.createDiary
  })

  // Handlers
  const initializeMeasurementsForm = (measurements: PreviewDiaryResponse) => {
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

    measurementsMethods.reset(formData)
  }

  return {
    stepOneMethods,
    stepTwoMethods,
    measurementsMethods,
    initializeMeasurementsForm,
    previewDiaryMutation,
    createDiaryMutation
  }
}
