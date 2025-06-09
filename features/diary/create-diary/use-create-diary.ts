import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  personalInfoFormSchema,
  PersonalInfoFormSchema,
  pregnancyInfoFormSchema,
  PregnancyInfoFormSchema
} from './validations'

const defaultValuesStepOne: PersonalInfoFormSchema = {
  name: '',
  weight: '',
  height: '',
  dateOfBirth: ''
}

const defaultValuesStepTwo: PregnancyInfoFormSchema = {
  firstDateOfLastPeriod: '',
  bust: '',
  waist: '',
  hip: '',
  numberOfPregnancy: '',
  averageMenstrualCycle: null,
  ultrasoundDate: null,
  weeksFromUltrasound: null,
  dueDateFromUltrasound: null
}

export const useCreateDiary = () => {
  const stepOneMethods = useForm<PersonalInfoFormSchema>({
    defaultValues: defaultValuesStepOne,
    resolver: zodResolver(personalInfoFormSchema)
  })

  const stepTwoMethods = useForm<PregnancyInfoFormSchema>({
    defaultValues: defaultValuesStepTwo,
    resolver: zodResolver(pregnancyInfoFormSchema)
  })

  return {
    stepOneMethods,
    stepTwoMethods
  }
}
