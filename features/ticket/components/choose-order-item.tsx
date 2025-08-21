import { format } from 'date-fns'
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { Order, OrderItem } from '~/types/order.type'

interface ChooseOrderItemProps {
  orderRequests: Order[] | null | undefined
  selectedOrderItem: OrderItem | null
  isLoading: boolean
  refreshControl: React.JSX.Element
  isDisabled: boolean
  handleSelectOrderItem: (orderItem: OrderItem) => void
  handleNext: () => void
}

const OrderItemRow = ({
  orderItem,
  isSelected,
  onSelect
}: {
  orderItem: OrderItem
  isSelected: boolean
  onSelect: () => void
}) => {
  return (
    <TouchableOpacity className='flex-row items-center gap-4' onPress={onSelect}>
      <View className='w-5 h-5 border border-border rounded-full justify-center items-center'>
        {isSelected && <View className='w-3 h-3 bg-primary rounded-full' />}
      </View>
      <View className='flex-1 flex-row items-start gap-2'>
        <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
          <Image source={{ uri: orderItem?.preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
        </View>
        <View className='flex-1 h-20 justify-between pr-2'>
          <View>
            <Text className='native:text-sm font-inter-medium'>
              {orderItem?.preset?.styleName || 'Váy Bầu Tùy Chỉnh'}
            </Text>
            <Text className='native:text-xs text-muted-foreground'>SKU: {orderItem?.preset?.sku}</Text>
          </View>
          <View className='items-end'>
            <Text className='native:text-xs'>x{orderItem?.quantity || 1}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const OrderCard = ({
  order,
  handleSelectOrderItem,
  selectedOrderItem
}: {
  order: Order
  handleSelectOrderItem: (orderItem: OrderItem) => void
  selectedOrderItem: OrderItem | null
}) => {
  return (
    <Card style={styles.container}>
      <View className='flex-row items-center gap-2 p-2'>
        <Text className='native:text-sm font-inter-medium flex-1 pl-1'>Đơn hàng #{order.code}</Text>
      </View>

      <Separator />

      <View className='p-3 gap-2'>
        {order.items.map((orderItem) => (
          <OrderItemRow
            key={orderItem.id}
            orderItem={orderItem}
            isSelected={selectedOrderItem?.id === orderItem.id}
            onSelect={() => handleSelectOrderItem(orderItem)}
          />
        ))}
      </View>

      <Separator />

      <View className='flex-row items-center gap-2 p-3'>
        <Text className='flex-1 text-xs text-muted-foreground/80'>Nhận hàng</Text>
        <Text className='text-foreground/80 text-xs'>
          {order?.receivedAt ? format(new Date(order.receivedAt), "MMM dd, yyyy 'lúc' hh:mm a") : 'N/A'}
        </Text>
      </View>
    </Card>
  )
}

export default function ChooseOrderItem({
  orderRequests,
  selectedOrderItem,
  isLoading,
  refreshControl,
  isDisabled,
  handleNext,
  handleSelectOrderItem
}: ChooseOrderItemProps) {
  return (
    <View className='flex-1'>
      <FlatList
        data={orderRequests}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(200 + index * 50)}>
            <OrderCard
              order={item}
              handleSelectOrderItem={handleSelectOrderItem}
              selectedOrderItem={selectedOrderItem}
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
        contentContainerClassName='gap-3 p-4'
        refreshControl={refreshControl}
      />

      {orderRequests && Array.isArray(orderRequests) && orderRequests.length > 0 ? (
        <View className='px-4 pt-4'>
          <Button onPress={handleNext} disabled={isDisabled}>
            <Text className='font-inter-medium'>Tiếp tục</Text>
          </Button>
        </View>
      ) : null}
    </View>
  )
}
