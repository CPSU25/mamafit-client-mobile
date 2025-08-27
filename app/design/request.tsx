import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import FieldError from '~/components/field-error'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import CreateDesignRequestForm from '~/features/design-request/components/create-request-form'
import { usePlaceDesignRequestOrder } from '~/features/order/hooks/use-place-design-request-order'
import { PlaceDesignRequestOrderFormSchema } from '~/features/order/validations'
import { useImagePicker } from '~/hooks/use-image-picker'
import { FILE_PATH, PRIMARY_COLOR } from '~/lib/constants/constants'

export default function DesignRequestScreen() {
  const router = useRouter()
  const { methods, placeDesignRequestMutation } = usePlaceDesignRequestOrder()
  const {
    formState: { errors }
  } = methods

  const currentImages = methods.watch('images')

  const { pickImages, resetImages, isUploading, isMaxReached } = useImagePicker({
    maxImages: 5,
    maxSizeInMB: 5,
    initialImages: currentImages,
    path: FILE_PATH.DESIGN_REQUEST
  })

  const rootMsg = errors.root?.message || (errors as any)['']?.message || (errors as any)._errors?.[0]

  const onSubmit: SubmitHandler<PlaceDesignRequestOrderFormSchema> = (data) => {
    placeDesignRequestMutation.mutate(data)
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-3 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl'>Liên hệ Designer</Text>
      </View>

      <View className='bg-muted h-2' />

      <View className='flex-1 p-4'>
        <FormProvider {...methods}>
          <CreateDesignRequestForm
            pickImages={pickImages}
            resetImages={resetImages}
            isUploading={isUploading}
            isMaxReached={isMaxReached}
            currentImages={currentImages}
          />
        </FormProvider>
        <View className='flex-1' />
        <View className='flex flex-col gap-2'>
          {rootMsg && <FieldError message={rootMsg} />}
          <Button
            onPress={methods.handleSubmit(onSubmit)}
            disabled={placeDesignRequestMutation.isPending || isUploading}
          >
            <Text className='font-inter-medium'>
              {placeDesignRequestMutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Text>
          </Button>
        </View>
      </View>
    </SafeView>
  )
}
