import { MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { InfoCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { WarrantyStatusBadge } from '~/features/warranty-request/components/warranty-status-badge'
import { canSelectOrderItem } from '~/features/warranty-request/utils'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { Order, OrderItem } from '~/types/order.type'

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

const OrderItemRow = ({
  orderItem,
  isSelected,
  onSelect,
  isDisabled
}: {
  orderItem: OrderItem
  isSelected: boolean
  onSelect: () => void
  isDisabled: boolean
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center gap-4 ${isDisabled ? 'opacity-40' : 'opacity-100'}`}
      onPress={onSelect}
      disabled={isDisabled}
    >
      <View className='w-5 h-5 border border-border rounded-md justify-center items-center'>
        {isSelected ? <MaterialCommunityIcons name='check-bold' size={14} color={PRIMARY_COLOR.LIGHT} /> : null}
      </View>
      <View className='flex-1 flex-row items-start gap-2'>
        <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
          <Image source={{ uri: orderItem?.preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
        </View>
        <View className='flex-1 h-20 justify-between pr-2'>
          <View>
            <Text className='native:text-sm font-inter-medium'>{orderItem?.preset?.styleName || 'Custom'} Dress</Text>
            <View className='flex-row items-center justify-between'>
              <Text className='native:text-xs text-muted-foreground'>
                {orderItem?.preset?.styleName ? 'Made-to-Order Custom Style' : 'Tailored Just for You'}
              </Text>
              <Text className='native:text-xs text-muted-foreground'>x{orderItem?.quantity || 1}</Text>
            </View>
          </View>
          <View className='items-end'>
            <Text className='native:text-xs'>SKU: {orderItem?.preset?.sku}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const OrderCard = ({
  order,
  warrantyPeriod,
  selectedWarrantyType,
  handleSelectOrderItem,
  isSelected
}: {
  order: Order
  warrantyPeriod: number
  selectedWarrantyType: 'free' | 'expired' | null
  handleSelectOrderItem: (orderItem: OrderItem) => void
  isSelected: (orderItem: OrderItem) => boolean
}) => {
  return (
    <Card style={styles.container}>
      <View className='flex-row items-center gap-2 p-2'>
        <Text className='native:text-sm font-inter-medium flex-1 pl-1'>Order #{order.code}</Text>
        <WarrantyStatusBadge receivedAt={order.receivedAt ?? ''} warrantyPeriod={warrantyPeriod} />
      </View>

      <Separator />

      <View className='p-3'>
        {order.items.map((orderItem) => {
          const canSelect = canSelectOrderItem(orderItem, selectedWarrantyType, order.receivedAt ?? '', warrantyPeriod)

          return (
            <OrderItemRow
              key={orderItem.id}
              orderItem={orderItem}
              isSelected={isSelected(orderItem)}
              onSelect={() => {
                if (canSelect) {
                  handleSelectOrderItem(orderItem)
                }
              }}
              isDisabled={!canSelect}
            />
          )
        })}
      </View>

      <Separator />

      <View className='flex-row items-center gap-2 p-3'>
        <Text className='flex-1 text-xs text-muted-foreground/80'>Order Received</Text>
        <Text className='text-foreground/80 text-xs'>
          {order?.receivedAt ? format(new Date(order.receivedAt), "MMM dd, yyyy 'at' hh:mm a") : 'N/A'}
        </Text>
      </View>
    </Card>
  )
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
  const router = useRouter()

  return (
    <View className='flex-1'>
      <FlatList
        data={orderRequests}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          orderRequests && Array.isArray(orderRequests) && orderRequests.length > 0 ? (
            <TouchableOpacity onPress={() => router.push('/order/warranty/policy')}>
              <InfoCard delay={100} title='Warranty Request Policy'>
                <Text className='text-xs text-sky-600 dark:text-sky-500'>
                  Each order item includes {warrantyCount} free warranty requests. Additional requests may incur a
                  service fee <Text className='text-xs text-sky-600 font-inter-medium underline'>(press for more)</Text>
                  .
                </Text>
              </InfoCard>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(200 + index * 50)}>
            <OrderCard
              order={item}
              warrantyPeriod={warrantyPeriod}
              selectedWarrantyType={selectedWarrantyType}
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
              <Text className='text-sm text-muted-foreground'>No valid orders found</Text>
            </View>
          )
        }
        contentContainerClassName='gap-2 p-2'
        refreshControl={refreshControl}
      />

      {orderRequests && Array.isArray(orderRequests) && orderRequests.length > 0 ? (
        <View className='px-2'>
          <Button onPress={handleNext} disabled={isDisabled}>
            <Text className='font-inter-medium'>Continue</Text>
          </Button>
        </View>
      ) : null}
    </View>
  )
}
