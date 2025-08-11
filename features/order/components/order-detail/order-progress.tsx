import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { OrderItemMilestone } from '~/types/order.type'
import OrderStageBar from './order-stage-bar'

interface OrderProgressProps {
  isViewMoreOrderProgress: boolean
  completedMilestones: OrderItemMilestone[] | null
  allCompletedMilestones: OrderItemMilestone[] | null
  setIsViewMoreOrderProgress: (value: boolean) => void
  setCompletedMilestones: (value: OrderItemMilestone[] | null) => void
  milestones: OrderItemMilestone[] | null | undefined
  currentMilestone: OrderItemMilestone | null
  createdAt: string | undefined
}

export default function OrderProgress({
  isViewMoreOrderProgress,
  completedMilestones,
  allCompletedMilestones,
  setIsViewMoreOrderProgress,
  setCompletedMilestones,
  milestones,
  currentMilestone,
  createdAt
}: OrderProgressProps) {
  const { isDarkColorScheme } = useColorScheme()

  const toggleViewMoreOrderProgress = (value: boolean) => {
    setIsViewMoreOrderProgress(value)
  }

  return (
    <Card className='bg-muted/5' style={styles.container}>
      <View className='px-3 py-2 flex-row items-center gap-2'>
        <MaterialCommunityIcons name='clipboard-text-clock' size={16} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium text-sm'>Order Progress</Text>
      </View>

      {milestones && Array.isArray(milestones) && milestones.length > 0 ? (
        <OrderStageBar
          milestones={milestones}
          currentMilestone={currentMilestone}
          completedMilestones={completedMilestones}
          orderPlacedAt={createdAt}
        />
      ) : (
        <View className='flex-row items-center justify-center my-10'>
          <Text className='text-muted-foreground text-xs'>No order progress available</Text>
        </View>
      )}

      {(allCompletedMilestones?.length || 0) > 2 ? (
        <View className='mb-2'>
          {isViewMoreOrderProgress ? (
            <TouchableOpacity
              className='flex-row items-center gap-1 justify-center p-2'
              onPress={() => toggleViewMoreOrderProgress(false)}
            >
              <Text className='text-muted-foreground text-xs'>View Less</Text>
              <Feather name='chevron-up' color={isDarkColorScheme ? 'lightgray' : 'gray'} size={16} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className='flex-row items-center gap-1 justify-center p-2'
              onPress={() => toggleViewMoreOrderProgress(true)}
            >
              <Text className='text-muted-foreground text-xs'>View More</Text>
              <Feather name='chevron-down' color={isDarkColorScheme ? 'lightgray' : 'gray'} size={16} />
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </Card>
  )
}
