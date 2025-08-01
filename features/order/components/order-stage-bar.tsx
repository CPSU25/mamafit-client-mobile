import { MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, ScrollView, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { cn } from '~/lib/utils'
import { OrderItemMilestone } from '~/types/order.type'

const STAGE_WIDTH = 50

interface OrderStageBarProps {
  milestones: OrderItemMilestone[]
  currentMilestone: OrderItemMilestone | null
  completedMilestones: OrderItemMilestone[] | null
  orderPlacedAt: string | undefined
}

const getIconForMilestone = (milestoneName: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  const name = milestoneName.toLowerCase()
  if (name.includes('production')) return 'factory'
  if (name.includes('design')) return 'palette'
  if (name.includes('add on')) return 'plus-box-multiple'
  if (name.includes('warranty') && name.includes('check')) return 'shield-check'
  if (name.includes('warranty')) return 'shield'
  if (name.includes('quality')) return 'clock-check'
  if (name.includes('packing') || name.includes('delivery')) return 'truck-fast'
  return 'circle-outline'
}

export default function OrderStageBar({
  milestones,
  currentMilestone,
  completedMilestones,
  orderPlacedAt
}: OrderStageBarProps) {
  const orderItemMilestones = useMemo(() => (milestones && Array.isArray(milestones) ? milestones : []), [milestones])
  const scrollViewRef = useRef<ScrollView>(null)
  const scaleAnims = useRef(orderItemMilestones.map(() => new Animated.Value(1))).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const progressAnims = useRef(orderItemMilestones.map(() => new Animated.Value(0))).current

  const [scrollViewWidth, setScrollViewWidth] = useState(0)
  const [stageLayouts, setStageLayouts] = useState<{ [key: string]: { x: number; width: number } }>({})

  useEffect(() => {
    // Reset all scales to normal and animate progress bars
    orderItemMilestones.forEach((milestone, index) => {
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true
      }).start()

      // Animate progress bar based on milestone progress
      const targetProgress = milestone.progress / 100

      Animated.timing(progressAnims[index], {
        toValue: targetProgress,
        duration: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false
      }).start()
    })

    if (currentMilestone) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      )
      pulseAnimation.start()

      return () => {
        pulseAnimation.stop()
      }
    }
  }, [currentMilestone, pulseAnim, scaleAnims, progressAnims, milestones, orderItemMilestones])

  // Auto-scroll to center the selected milestone
  useEffect(() => {
    const selectedMilestoneLayout = currentMilestone ? stageLayouts[currentMilestone.milestone.milestoneId] : null
    if (selectedMilestoneLayout && scrollViewRef.current && scrollViewWidth > 0) {
      const stageCenterX = selectedMilestoneLayout.x + STAGE_WIDTH / 2
      const centerPosition = stageCenterX - scrollViewWidth / 2
      const scrollPosition = Math.max(0, centerPosition)

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollPosition,
          animated: true
        })
      }, 100)
    }
  }, [currentMilestone, stageLayouts, scrollViewWidth])

  const handleStageLayout = (milestoneId: string, event: any) => {
    const { x, width } = event.nativeEvent.layout
    setStageLayouts((prev) => ({
      ...prev,
      [milestoneId]: { x, width }
    }))
  }

  const handleScrollViewLayout = (event: any) => {
    const { width } = event.nativeEvent.layout
    setScrollViewWidth(width)
  }

  const renderMilestoneIcon = (milestone: OrderItemMilestone, index: number) => {
    const isCompleted = milestone.progress === 100
    const isInProgress = milestone.progress > 0 && milestone.progress < 100
    const isCurrent = milestone.milestone.milestoneId === currentMilestone?.milestone.milestoneId
    const isNotStarted = milestone.progress === 0

    return (
      <View style={{ opacity: isNotStarted && !isCurrent ? 0.6 : 1 }}>
        <Animated.View
          style={{
            transform: [
              {
                scale: isCurrent ? pulseAnim : scaleAnims[index]
              }
            ]
          }}
        >
          {isCompleted ? (
            <LinearGradient
              colors={['#6ee7b7', '#34d399', '#10b981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className='w-10 h-10 rounded-full overflow-hidden items-center justify-center'
              style={{
                boxShadow: '0 0 6px 0 rgba(16, 185, 129, 0.8)'
              }}
            >
              <MaterialCommunityIcons
                name={getIconForMilestone(milestone.milestone.milestoneName)}
                color='white'
                size={16}
              />
            </LinearGradient>
          ) : isInProgress || isCurrent ? (
            <LinearGradient
              colors={['#fb923c', '#f97316', '#ea580c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className='w-10 h-10 rounded-full overflow-hidden items-center justify-center'
              style={{
                boxShadow: '0 0 6px 0 rgba(249, 115, 22, 0.8)'
              }}
            >
              <MaterialCommunityIcons
                name={getIconForMilestone(milestone.milestone.milestoneName)}
                color='white'
                size={16}
              />
            </LinearGradient>
          ) : (
            <View className='w-10 h-10 rounded-full overflow-hidden items-center justify-center bg-muted'>
              <MaterialCommunityIcons
                name={getIconForMilestone(milestone.milestone.milestoneName)}
                color='gray'
                size={16}
              />
            </View>
          )}
        </Animated.View>
      </View>
    )
  }

  return (
    <View className='flex-1'>
      <ScrollView
        ref={scrollViewRef}
        className='flex-1'
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={handleScrollViewLayout}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View className='flex-row items-center p-3'>
          {milestones.map((milestone, index) => (
            <View
              key={milestone.milestone.milestoneId}
              className='flex-row'
              onLayout={(event) => handleStageLayout(milestone.milestone.milestoneId, event)}
            >
              <View className='items-center gap-2' style={{ width: STAGE_WIDTH }}>
                {renderMilestoneIcon(milestone, index)}
              </View>

              {index !== milestones.length - 1 ? (
                <View className='h-1.5 w-14 mt-[16px] rounded-full bg-muted overflow-hidden'>
                  <Animated.View
                    className={cn(
                      'h-full rounded-full',
                      milestone.progress === 100
                        ? 'bg-emerald-400'
                        : milestone.progress > 0
                          ? 'bg-orange-400'
                          : 'bg-muted-foreground'
                    )}
                    style={{
                      width: progressAnims[index]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }}
                  />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
      <View className='mt-2 gap-1.5 p-3'>
        {completedMilestones && Array.isArray(completedMilestones)
          ? completedMilestones.map((milestone) => (
              <View key={milestone.milestone.milestoneId} className='flex-row items-center gap-2'>
                <View className='flex-row items-center gap-2 flex-1'>
                  <View className='w-3 h-3 rounded-full bg-emerald-400' />
                  <Text className='text-sm font-inter-medium flex-1' numberOfLines={1}>
                    {milestone.milestone.milestoneName}
                  </Text>
                </View>
                <Text className='text-xs text-muted-foreground/50 text-right'>
                  {milestone?.milestone.milestoneName === 'Order Placed'
                    ? orderPlacedAt
                      ? format(new Date(orderPlacedAt), "MMM dd, yyyy 'at' hh:mm a")
                      : null
                    : 'Completed'}
                </Text>
              </View>
            ))
          : null}
        {currentMilestone ? (
          <View className='flex-row items-center gap-2'>
            <View className='flex-row items-center gap-2 flex-1'>
              <View className='w-3 h-3 rounded-full' style={{ backgroundColor: '#fb923c' }} />
              <Text className='text-sm font-inter-medium flex-1' numberOfLines={1}>
                {currentMilestone.milestone.milestoneName}
              </Text>
            </View>
            <Text className='text-xs text-muted-foreground'>{currentMilestone.currentTask?.name || ''}</Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}
