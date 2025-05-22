import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { Controller, FieldName } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants'
import { useRegister } from './use-register'
import { RegisterFormSchema } from './validations'

const steps = [
  { id: 1, name: 'Email', field: ['email'] },
  {
    id: 2,
    name: 'Code verification',
    field: ['code']
  },
  {
    id: 3,
    name: 'Password',
    field: ['password', 'confirmPassword']
  }
]

export default function RegisterStep() {
  const [currentStep, setCurrentStep] = useState(1)
  const {
    methods: { control, handleSubmit, reset, trigger }
  } = useRegister()

  const next = async () => {
    const fields = steps[currentStep - 1].field
    const output = await trigger(fields as FieldName<RegisterFormSchema>[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
      // TODO: Submit the form base on current step
    }
  }

  const prev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  switch (currentStep) {
    case 2:
      return (
        <View>
          <Button onPress={prev}>
            <Text>Go back</Text>
          </Button>
        </View>
      )
    case 3:
      return (
        <View>
          <Button onPress={prev}>
            <Text>Go back</Text>
          </Button>
        </View>
      )
    default:
      return (
        <View className='flex-1 flex flex-col mt-6'>
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                {...field}
                value={value}
                onChangeText={onChange}
                placeholder='example@email.com'
                StartIcon={<Feather name='mail' size={20} color={PRIMARY_COLOR.LIGHT} />}
                autoFocus
                spellCheck={false}
              />
            )}
          />
          <View className='flex-1' />
          <Button className='mb-6' onPress={next}>
            <Text className='font-inter-medium'>Continue</Text>
          </Button>
        </View>
      )
  }
}
