import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { personalInfoFormSchema, PersonalInfoFormSchema } from './validations'

const defaultValues: PersonalInfoFormSchema = {
  name: '',
  weight: '',
  height: '',
  dateOfBirth: ''
}

export const useCreateDiary = () => {
  const stepOneMethods = useForm<PersonalInfoFormSchema>({
    defaultValues,
    resolver: zodResolver(personalInfoFormSchema)
  })

  return {
    stepOneMethods
  }
}
