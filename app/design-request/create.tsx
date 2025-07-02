import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FieldError from '~/components/field-error'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import CreateDesignRequestForm from '~/features/design-request/components/create-request-form'
import { useCreateDesignRequest } from '~/features/design-request/hooks/use-create-design-request'
import { CreateRequestSchema } from '~/features/design-request/validations'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function CreateDesignRequest() {
  const router = useRouter()
  const { methods, createDesignRequestMutation } = useCreateDesignRequest()
  const {
    formState: { errors }
  } = methods

  const rootMsg = errors.root?.message || (errors as any)['']?.message || (errors as any)._errors?.[0]

  const onSubmit: SubmitHandler<CreateRequestSchema> = (data) => {
    createDesignRequestMutation.mutate(data)
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Contact Our Designer</Text>
      </View>

      <View className='bg-muted h-2' />

      <View className='flex-1 p-4'>
        <FormProvider {...methods}>
          <CreateDesignRequestForm />
        </FormProvider>
        <View className='flex-1' />
        <View className='flex flex-col gap-2'>
          {rootMsg && <FieldError message={rootMsg} />}
          <Button onPress={methods.handleSubmit(onSubmit)} disabled={createDesignRequestMutation.isPending}>
            <Text className='font-inter-medium'>
              {createDesignRequestMutation.isPending ? 'Sending...' : 'Send Request'}
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
