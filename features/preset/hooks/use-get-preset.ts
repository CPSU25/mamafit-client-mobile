import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import presetService from '~/services/preset.service'
import { dressBuilderFormSchema, DressBuilderFormSchema } from '../validations'

export const useGetPreset = () => {
  const methods = useForm<DressBuilderFormSchema>({
    defaultValues: {
      categoryId: '',
      styleId: '',
      color: '',
      sleeves: '',
      waist: '',
      fabric: '',
      neckline: '',
      hem: ''
    },
    resolver: zodResolver(dressBuilderFormSchema)
  })

  const getPresetMutation = useMutation({
    mutationFn: presetService.getPreset
  })

  return {
    methods,
    getPresetMutation
  }
}
