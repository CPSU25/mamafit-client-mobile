import { ActivityIndicator, FlatList, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { InfoCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { Order, OrderItem } from '~/types/order.type'
import OrderCard from './order-card'

interface ChooseOrderItemsProps {
  orderRequests: Order[] | null | undefined
  handleSelectOrderItem: (orderItem: OrderItem) => void
  isSelected: (orderItem: OrderItem) => boolean
  warrantyPeriod: number
  isLoading: boolean
  refreshControl: React.JSX.Element
  selectedWarrantyType: 'free' | 'expired' | null
  warrantyCount: number
  handleNext: () => void
  isDisabled: boolean
}

export default function ChooseOrderItems({
  orderRequests,
  handleSelectOrderItem,
  isSelected,
  warrantyPeriod,
  isLoading,
  refreshControl,
  selectedWarrantyType,
  warrantyCount,
  handleNext,
  isDisabled
}: ChooseOrderItemsProps) {
  return (
    <View className='flex-1'>
      <FlatList
        data={orderRequests}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          orderRequests && Array.isArray(orderRequests) && orderRequests.length > 0 ? (
            <InfoCard delay={100} title='Chính sách bảo hành'>
              <Text className='text-xs text-sky-600 dark:text-sky-500'>
                Mỗi món hàng có {warrantyCount} yêu cầu bảo hành miễn phí. Các yêu cầu sau đó có thể tính phí dịch
                vụ.{' '}
              </Text>
            </InfoCard>
          ) : null
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(200 + index * 50)}>
            <OrderCard
              order={item}
              selectedWarrantyType={selectedWarrantyType}
              warrantyPeriod={warrantyPeriod}
              warrantyCount={warrantyCount}
              handleSelectOrderItem={handleSelectOrderItem}
              isSelected={isSelected}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
          ) : (
            <View className='flex-1 items-center justify-center mt-12'>
              <Text className='text-sm text-muted-foreground'>Không tìm thấy đơn hàng hợp lệ</Text>
            </View>
          )
        }
        contentContainerClassName='gap-3 p-2'
        refreshControl={refreshControl}
      />

      {orderRequests && Array.isArray(orderRequests) && orderRequests.length > 0 ? (
        <View className='px-2'>
          <Button onPress={handleNext} disabled={isDisabled}>
            <Text className='font-inter-medium'>Tiếp tục</Text>
          </Button>
        </View>
      ) : null}
    </View>
  )
}
