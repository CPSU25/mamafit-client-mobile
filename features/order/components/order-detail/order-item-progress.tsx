import { OrderItemMilestone } from '~/types/order.type'
import OrderStageBar from './order-stage-bar'
import { Card } from '~/components/ui/card'

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
        <Card className='p-3 bg-muted/5 border-dashed'>
          <OrderStageBar
            milestones={milestones}
            currentMilestone={currentMilestone}
            completedMilestones={completedMilestones}
            orderPlacedAt={createdAt}
          />
        </Card>
      ) : null}
    </>
  )
}
