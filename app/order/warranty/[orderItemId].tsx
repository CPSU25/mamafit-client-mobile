import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import SafeView from '~/components/safe-view'
import { InfoCard, TipCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import CreateWarrantyRequestForm from '~/features/warranty-request/components/create-warranty-request-form'
import { useCreateWarrantyRequest } from '~/features/warranty-request/hooks/use-create-warranty-request'
import { CreateWarrantyRequestSchema } from '~/features/warranty-request/validations'
import { useImagePicker } from '~/hooks/use-image-picker'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'

export default function CreateWarrantyRequestScreen() {
  const router = useRouter()
  const { methods } = useCreateWarrantyRequest()

  const currentImages = methods.watch('images')

  const { pickImages, resetImages, isUploading, isMaxReached } = useImagePicker({
    maxImages: 5,
    maxSizeInMB: 5,
    initialImages: currentImages
  })

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  const onSubmit: SubmitHandler<CreateWarrantyRequestSchema> = (data) => {
    console.log(data)
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Submit Warranty Request</Text>
      </View>

      <View className='bg-muted h-2' />

      <View className='flex-1 gap-4 p-4'>
        <Animated.View entering={FadeInDown.delay(100)}>
          <Card className='p-3' style={styles.container}>
            <Text>Order item detail goes here</Text>
          </Card>
        </Animated.View>

        <FormProvider {...methods}>
          <CreateWarrantyRequestForm
            pickImages={pickImages}
            resetImages={resetImages}
            isUploading={isUploading}
            isMaxReached={isMaxReached}
            currentImages={currentImages}
          />

          <TipCard title='Tips' delay={400}>
            <View className='flex flex-col gap-1'>
              <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
                • Describe the defect and where it appears.
              </Text>
              <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
                • Upload mandatory high-res photos (multiple angles).
              </Text>
              <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
                • Make sure images are well-lit and sharply focused.
              </Text>
            </View>
          </TipCard>

          <TouchableOpacity onPress={() => router.push('/order/warranty/policy')}>
            <InfoCard delay={500} title='Warranty Request Policy'>
              <Text className='text-xs text-sky-600 dark:text-sky-500'>
                Each order item is eligible for one free warranty request. Any subsequent warranty requests for the same
                item may incur a service fee{' '}
                <Text className='text-xs text-sky-600 font-inter-medium underline'>(press for more)</Text>.
              </Text>
            </InfoCard>
          </TouchableOpacity>

          <View className='flex-1' />

          <Button onPress={methods.handleSubmit(onSubmit)} disabled={isUploading}>
            <Text className='font-inter-medium'>Submit Warranty</Text>
          </Button>
        </FormProvider>
      </View>
    </SafeView>
  )
}
