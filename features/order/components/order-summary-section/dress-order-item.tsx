import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Image, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { DressVariant } from '~/types/dress.type'
import { OrderItemType } from '~/types/order.type'
import { AddOnOptionItem } from '../../types'
import PreviewAddOnOptionCard from '../add-on-section/preview-add-on-option-card'

interface DressOrderItemProps {
  dress: DressVariant
  dressOptions: AddOnOptionItem[]
  iconSize: number
  quantity: number
  onRemoveAddOnOption: (dressId: string, optionId: string) => void
}

export default function DressOrderItem({
  dress,
  dressOptions,
  iconSize,
  quantity,
  onRemoveAddOnOption
}: DressOrderItemProps) {
  const router = useRouter()
  const hasOptions = dressOptions && Array.isArray(dressOptions) && dressOptions.length > 0

  return (
    <View className='p-3 gap-3'>
      <View className='flex-row items-center gap-3'>
        <View className='w-20 h-20 overflow-hidden relative rounded-xl'>
          <Image
            source={{ uri: dress?.image[0] }}
            style={{
              width: '100%',
              height: '180%',
              borderRadius: 12,
              position: 'absolute',
              top: 0,
              left: 0
            }}
            resizeMode='cover'
          />
        </View>

        <View className='flex-1 h-20 justify-between'>
          <View>
            <Text className='native:text-sm font-inter-medium' numberOfLines={1}>
              {dress?.name || 'Váy có sẵn'}
            </Text>
            <View className='flex-row items-center justify-between'>
              <Text className='native:text-xs text-muted-foreground'>
                Phân loại: {dress?.color} - {dress?.size}
              </Text>
              <Text className='native:text-xs text-muted-foreground'>x{quantity || 1}</Text>
            </View>
          </View>
          <View className='items-end'>
            <Text className='native:text-xs'>
              <Text className='native:text-xs underline'>đ</Text>
              {dress?.price?.toLocaleString('vi-VN') || '0'}
            </Text>
          </View>
        </View>
      </View>

      <View className='bg-blue-50 rounded-xl p-1'>
        <TouchableOpacity
          onPress={() => router.push(`/order/review/choose-add-on?itemId=${dress.id}&type=${OrderItemType.ReadyToBuy}`)}
        >
          <View className='flex-row items-center p-2 gap-2'>
            <MaterialCommunityIcons name='plus-box-multiple' size={iconSize} color='#2563eb' />
            <Text className='font-inter-medium native:text-sm text-blue-600 flex-1'>MamaFit Add-Ons</Text>
            {hasOptions ? (
              <Feather name='chevron-down' size={iconSize} color='#2563eb' />
            ) : (
              <Feather name='chevron-right' size={iconSize} color='#2563eb' />
            )}
          </View>
        </TouchableOpacity>

        {hasOptions ? (
          <>
            <Card className='p-1 rounded-xl gap-2'>
              {dressOptions.map((option) => (
                <View key={option.addOnOptionId}>
                  <PreviewAddOnOptionCard
                    option={option}
                    onRemove={() => onRemoveAddOnOption(dress.id, option.addOnOptionId)}
                    iconSize={iconSize}
                    quantity={quantity}
                  />
                </View>
              ))}
            </Card>
            <TouchableOpacity
              onPress={() =>
                router.push(`/order/review/choose-add-on?itemId=${dress.id}&type=${OrderItemType.ReadyToBuy}`)
              }
              className='flex-row items-center gap-2 justify-center py-2'
            >
              <Feather name='plus' size={iconSize} color='#2563eb' />
              <Text className='native:text-sm text-blue-600 font-inter-medium'>
                Thêm dịch vụ ({dressOptions.length})
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  )
}
