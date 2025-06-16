import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import diaryApi from '~/apis/diary.api'
import {
  PersonalInfoFormInput,
  PersonalInfoFormOutput,
  personalInfoFormOutput,
  PregnancyInfoFormInput,
  PregnancyInfoFormOutput,
  pregnancyInfoFormOutput
} from './validations'
import { useRouter } from 'expo-router'

const defaultValuesStepOne: PersonalInfoFormInput = {
  name: 'Danh Nguyen',
  weight: '80',
  height: '170',
  age: '22'
}

const defaultValuesStepTwo: PregnancyInfoFormInput = {
  firstDateOfLastPeriod: '2025-01-01',
  bust: '80',
  waist: '60',
  hip: '90',
  numberOfPregnancy: '1',
  averageMenstrualCycle: '',
  ultrasoundDate: null,
  weeksFromUltrasound: ''
  // dueDateFromUltrasound: null
}

export const useCreateDiary = () => {
  const router = useRouter()
  const stepOneMethods = useForm<PersonalInfoFormInput, unknown, PersonalInfoFormOutput>({
    defaultValues: defaultValuesStepOne,
    resolver: zodResolver(personalInfoFormOutput)
  })

  const stepTwoMethods = useForm<PregnancyInfoFormInput, unknown, PregnancyInfoFormOutput>({
    defaultValues: defaultValuesStepTwo,
    resolver: zodResolver(pregnancyInfoFormOutput)
  })

  const previewDiaryMutation = useMutation({
    mutationFn: diaryApi.previewDiary
  })

  const createDiaryMutation = useMutation({
    mutationFn: diaryApi.createDiary,
    onSuccess: (data) => {
      if (data) {
        router.push(`/diary/detail/${data.diaryId}`)
      }
    }
  })

  return {
    stepOneMethods,
    stepTwoMethods,
    previewDiaryMutation,
    createDiaryMutation
  }
}
