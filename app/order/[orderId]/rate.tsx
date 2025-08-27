import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useEffect } from 'react'
import { FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import RateOrderForm from '~/features/feedback/components/rate-order-form'
import { useRateOrder } from '~/features/feedback/hooks/use-rate-order'
import { RateOrderFormSchema } from '~/features/feedback/validations'
import { useGetOrderForFeedback } from '~/features/order/hooks/use-get-order-for-feedback'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function RateOrderScreen() {
  const router = useRouter()
  const { methods, rateOrderMutation } = useRateOrder()
  const { orderId } = useLocalSearchParams<{ orderId: string }>()

  const { data: order, isLoading: isLoadingOrder } = useGetOrderForFeedback(orderId)

  const { fields, append } = useFieldArray({
    control: methods.control,
    name: 'ratings'
  })

  useEffect(() => {
    if (order?.items && fields.length === 0) {
      const initialRatings = order.items.map((item) => ({
        orderItemId: item.id,
        description: '',
        images: [],
        rated: 0
      }))

      initialRatings.forEach((rating) => append(rating))
    }
  }, [order?.items, fields.length, append])

  const onSubmit: SubmitHandler<RateOrderFormSchema> = (data) => {
    console.log(data.ratings)

    rateOrderMutation.mutate(data.ratings)
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  if (isLoadingOrder) {
    return <Loading />
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-3 px-4 pt-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl'>Đánh giá đơn hàng</Text>
      </View>

      <View className='flex-1'>
        <FormProvider {...methods}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false} className='flex-1'>
            <View className='gap-2 pt-4'>
              {fields.map((field, index) => {
                const orderItem = order?.items.find((item) => item.id === field.orderItemId)
                if (!orderItem) return null

                return (
                  <Animated.View entering={FadeInDown.delay(100 + index * 50)} className='px-2' key={field.id}>
                    <RateOrderForm index={index} orderItem={orderItem} />
                  </Animated.View>
                )
              })}
            </View>
          </KeyboardAwareScrollView>

          <View className='px-2 pt-4'>
            <Button onPress={methods.handleSubmit(onSubmit)} disabled={rateOrderMutation.isPending}>
              <Text className='font-inter-medium'>{rateOrderMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}</Text>
            </Button>
          </View>
        </FormProvider>
      </View>
    </SafeView>
  )
}
