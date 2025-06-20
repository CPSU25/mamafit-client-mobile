import { useRouter } from 'expo-router'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import CreateDesignRequestForm from '~/features/design-request/components/create-request-form'
import { useCreateRequest } from '~/features/design-request/hooks/use-create-request'
import { CreateRequestSchema } from '~/features/design-request/validations'

export default function CreateDesignRequest() {
  const router = useRouter()
  const { methods } = useCreateRequest()

  const onSubmit: SubmitHandler<CreateRequestSchema> = (data) => {
    console.log('Design Request: ', data)
    router.push({
      pathname: '/payment/[orderId]',
      params: { orderId: '123' }
    })
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1 p-4'>
        <FormProvider {...methods}>
          <CreateDesignRequestForm />
        </FormProvider>
        <View className='flex-1' />
        <Button onPress={methods.handleSubmit(onSubmit)}>
          <Text className='font-inter-medium'>Send Request</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}
