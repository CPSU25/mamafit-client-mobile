import { OrderItemMilestone } from '~/types/order.type'
import OrderStageBar from './order-stage-bar'

interface OrderItemProgressProps {
  completedMilestones: OrderItemMilestone[] | null
  milestones: OrderItemMilestone[] | null | undefined
  currentMilestone: OrderItemMilestone | null
  createdAt: string | undefined
}

export default function OrderItemProgress({
  completedMilestones,
  milestones,
  currentMilestone,
  createdAt
}: OrderItemProgressProps) {
  return (
    <>
      {milestones && Array.isArray(milestones) && milestones.length > 0 ? (
        <OrderStageBar
          milestones={milestones}
          currentMilestone={currentMilestone}
          completedMilestones={completedMilestones}
          orderPlacedAt={createdAt}
        />
      ) : null}
    </>
  )
}
