import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { Image, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import ChooseOrderItem from '~/features/ticket/components/choose-order-item'
import CreateTicketForm from '~/features/ticket/components/create-ticket-form'
import { useCreateTicket } from '~/features/ticket/hooks/use-create-ticket'
import { CreateTicketFormSchema } from '~/features/ticket/validations'
import { useGetOrderRequests } from '~/features/warranty-request/hooks/use-get-order-requests'
import { useImagePicker } from '~/hooks/use-image-picker'
import { useRefreshs } from '~/hooks/use-refresh'
import { useVideoPicker } from '~/hooks/use-video-picker'
import { FILE_PATH, PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { OrderItem } from '~/types/order.type'

export default function CreateTicketScreen() {
  const router = useRouter()

  const { methods, createTicketMutation } = useCreateTicket()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(null)

  const {
    data: orderRequests,
    isLoading: isLoadingOrderRequests,
    refetch: refetchOrderRequests
  } = useGetOrderRequests()

  const currentImages = methods.watch('images') || []
  const currentVideos = methods.watch('videos') || []

  const { pickImages, isUploading: isImageUploading } = useImagePicker({
    maxImages: 5,
    maxSizeInMB: 5,
    initialImages: currentImages,
    path: FILE_PATH.TICKET
  })

  const { pickVideos, isUploading: isVideoUploading } = useVideoPicker({
    maxVideos: 1,
    maxSizeInMB: 50,
    initialVideos: currentVideos,
    path: FILE_PATH.TICKET
  })

  const handleSelectOrderItem = useCallback(
    (orderItem: OrderItem) => {
      setSelectedOrderItem((prev) => {
        if (prev?.id === orderItem.id) {
          return null
        }
        methods.setValue('orderItemId', orderItem.id)
        return orderItem
      })
    },
    [methods]
  )

  const { refreshControl } = useRefreshs([refetchOrderRequests])

  const handleNext = useCallback(() => {
    if (selectedOrderItem) {
      setCurrentStep(2)
    }
  }, [selectedOrderItem])

  const handleGoBack = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }, [router, currentStep])

  const onSubmit: SubmitHandler<CreateTicketFormSchema> = (data) => {
    console.log(data)

    createTicketMutation.mutate(data)
  }

  return (
    <SafeView>
      <View className='flex-row items-center gap-2 p-4'>
        <View className='flex-row items-center gap-3 flex-1'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-medium text-xl'>Hỗ trợ</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/ticket/history')}>
          <Feather name='clock' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>

      <View className='bg-muted h-2' />

      <View className='flex-1'>
        {currentStep === 1 ? (
          <ChooseOrderItem
            orderRequests={orderRequests}
            handleSelectOrderItem={handleSelectOrderItem}
            selectedOrderItem={selectedOrderItem}
            isLoading={isLoadingOrderRequests}
            refreshControl={refreshControl}
            handleNext={handleNext}
            isDisabled={!selectedOrderItem}
          />
        ) : null}

        {currentStep === 2 ? (
          <View className='pt-4 flex-1'>
            <FormProvider {...methods}>
              <KeyboardAwareScrollView bottomOffset={50} className='flex-1' showsVerticalScrollIndicator={false}>
                <View className='gap-4 px-4'>
                  {selectedOrderItem ? (
                    <Card className='flex-row items-start gap-2 p-2' style={styles.container}>
                      <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
                        <Image
                          source={{ uri: selectedOrderItem?.preset?.images?.[0] }}
                          className='w-full h-full'
                          resizeMode='contain'
                        />
                      </View>
                      <View className='flex-1 h-20 justify-between pr-2'>
                        <View>
                          <Text className='native:text-sm font-inter-medium'>
                            {selectedOrderItem?.preset?.styleName || 'Váy Bầu Tùy Chỉnh'}
                          </Text>
                          <View className='flex-row items-center justify-between'>
                            <Text className='native:text-xs text-muted-foreground'>
                              {selectedOrderItem?.preset?.styleName ? 'Váy Bầu Tùy Chỉnh' : 'Váy Bầu Tùy Chỉnh'}
                            </Text>
                            <Text className='native:text-xs text-muted-foreground'>
                              x{selectedOrderItem?.quantity || 1}
                            </Text>
                          </View>
                        </View>
                        <View className='items-end'>
                          <Text className='native:text-xs'>SKU: {selectedOrderItem?.preset?.sku ?? 'N/A'}</Text>
                        </View>
                      </View>
                    </Card>
                  ) : null}

                  <CreateTicketForm
                    pickImages={pickImages}
                    pickVideos={pickVideos}
                    isImageUploading={isImageUploading}
                    currentImages={currentImages}
                    isVideoUploading={isVideoUploading}
                    currentVideos={currentVideos}
                  />
                </View>
              </KeyboardAwareScrollView>
              <View className='px-4 pt-4'>
                <Button onPress={methods.handleSubmit(onSubmit)} disabled={createTicketMutation.isPending}>
                  <Text className='font-inter-medium'>
                    {createTicketMutation.isPending ? 'Đang Gửi...' : 'Gửi Yêu Cầu'}
                  </Text>
                </Button>
              </View>
            </FormProvider>
          </View>
        ) : null}
      </View>
    </SafeView>
  )
}
