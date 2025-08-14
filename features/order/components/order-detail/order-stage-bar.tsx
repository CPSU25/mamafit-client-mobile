import { MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, ScrollView, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { cn } from '~/lib/utils'
import { OrderItemMilestone } from '~/types/order.type'

const STAGE_WIDTH = 50

interface OrderStageBarProps {
  milestones: OrderItemMilestone[] | null
  currentMilestone: OrderItemMilestone | null
  completedMilestones: OrderItemMilestone[] | null
  orderPlacedAt: string | undefined
}

const getIconForMilestone = (milestoneName: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  const name = milestoneName.toLowerCase()
  if (name.includes('production')) return 'factory'
  if (name.includes('design')) return 'palette'
  if (name.includes('add on')) return 'plus-box-multiple'
  if (name.includes('warranty') && name.includes('in')) return 'shield-refresh'
  if (name.includes('warranty') && name.includes('check')) return 'shield-check'
  if (name.includes('quality') && name.includes('check') && name.includes('warranty')) return 'check'
  if (name.includes('warranty') && name.includes('validation')) return 'shield'
  if (name.includes('quality') && name.includes('failed')) return 'clock-check'
  if (name.includes('quality')) return 'list-status'
  if (name.includes('packing')) return 'package-variant'
  if (name.includes('waiting') && name.includes('delivery')) return 'truck-fast'
  return 'progress-question'
}

export default function OrderStageBar({
  milestones = [],
  currentMilestone = null,
  completedMilestones = [],
  orderPlacedAt
}: OrderStageBarProps) {
  const orderItemMilestones = useMemo(() => (milestones && Array.isArray(milestones) ? milestones : []), [milestones])
  const scrollViewRef = useRef<ScrollView>(null)
  const pulseAnim = useRef(new Animated.Value(1)).current
  const scaleAnims = useRef<Animated.Value[]>([])
  const progressAnims = useRef<Animated.Value[]>([])
  const [scrollViewWidth, setScrollViewWidth] = useState(0)
  const [stageLayouts, setStageLayouts] = useState<{ [key: string]: { x: number; width: number } }>({})

  // Sync Animated.Value arrays with milestones
  useEffect(() => {
    scaleAnims.current = orderItemMilestones.map(() => new Animated.Value(1))
    progressAnims.current = orderItemMilestones.map(() => new Animated.Value(0))
  }, [orderItemMilestones])

  useEffect(() => {
    orderItemMilestones.forEach((milestone, index) => {
      if (scaleAnims.current[index] && progressAnims.current[index]) {
        setTimeout(() => {
          Animated.spring(scaleAnims.current[index], {
            toValue: 1,
            tension: 120,
            friction: 7,
            useNativeDriver: true
          }).start()
        }, index * 50)

        const targetProgress = milestone.progress / 100
        setTimeout(
          () => {
            Animated.timing(progressAnims.current[index], {
              toValue: targetProgress,
              duration: 1200,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: false
            }).start()
          },
          index * 100 + 200
        )
      }
    })

    if (currentMilestone) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      )
      pulseAnimation.start()
      return () => pulseAnimation.stop()
    }
  }, [currentMilestone, pulseAnim, orderItemMilestones])

  useEffect(() => {
    const selectedMilestoneLayout = currentMilestone ? stageLayouts[currentMilestone.milestone.id] : null
    if (selectedMilestoneLayout && scrollViewRef.current && scrollViewWidth > 0) {
      const stageCenterX = selectedMilestoneLayout.x + STAGE_WIDTH / 2
      const centerPosition = stageCenterX - scrollViewWidth / 2
      const scrollPosition = Math.max(0, centerPosition)

      const timeoutId = setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollPosition,
          animated: true
        })
      }, 150)

      return () => clearTimeout(timeoutId)
    }
  }, [currentMilestone, stageLayouts, scrollViewWidth])

  const handleStageLayout = useCallback((id: string, event: any) => {
    const { x, width } = event.nativeEvent.layout
    setStageLayouts((prev) => {
      const existing = prev[id]
      if (existing && existing.x === x && existing.width === width) {
        return prev
      }
      return {
        ...prev,
        [id]: { x, width }
      }
    })
  }, [])

  const handleScrollViewLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout
    setScrollViewWidth((prevWidth) => (prevWidth === width ? prevWidth : width))
  }, [])

  const renderMilestoneIcon = useCallback(
    (milestone: OrderItemMilestone, index: number) => {
      if (!scaleAnims.current[index]) {
        return null
      }

      const isCompleted = milestone.progress === 100 && milestone.isDone
      const isCompletedButFail = milestone.progress === 100 && !milestone.isDone
      const isInProgress = milestone.progress > 0 && milestone.progress < 100
      const isCurrent = milestone.milestone.id === currentMilestone?.milestone.id
      const isNotStarted = milestone.progress === 0

      return (
        <View style={{ opacity: isNotStarted && !isCurrent ? 0.6 : 1 }}>
          <Animated.View
            style={{
              transform: [
                {
                  scale: isCurrent ? pulseAnim : scaleAnims.current[index]
                }
              ]
            }}
          >
            {isCompletedButFail ? (
              <LinearGradient
                colors={['#f87171', '#dc2626', '#991b1b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className='w-10 h-10 rounded-full overflow-hidden items-center justify-center'
                style={{
                  boxShadow: '0 0 6px 0 rgba(153, 27, 27, 0.6)'
                }}
              >
                <MaterialCommunityIcons name={getIconForMilestone(milestone.milestone.name)} color='white' size={16} />
              </LinearGradient>
            ) : isCompleted ? (
              <LinearGradient
                colors={['#6ee7b7', '#34d399', '#10b981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className='w-10 h-10 rounded-full overflow-hidden items-center justify-center'
                style={{
                  boxShadow: '0 0 6px 0 rgba(18, 185, 129, 0.6)'
                }}
              >
                <MaterialCommunityIcons name={getIconForMilestone(milestone.milestone.name)} color='white' size={16} />
              </LinearGradient>
            ) : isInProgress || isCurrent ? (
              <LinearGradient
                colors={['#fb923c', '#f97318', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className='w-10 h-10 rounded-full overflow-hidden items-center justify-center'
                style={{
                  boxShadow: '0 0 6px 0 rgba(249, 115, 22, 0.6)'
                }}
              >
                <MaterialCommunityIcons name={getIconForMilestone(milestone.milestone.name)} color='white' size={16} />
              </LinearGradient>
            ) : (
              <View className='w-10 h-10 rounded-full overflow-hidden items-center justify-center bg-muted'>
                <MaterialCommunityIcons name={getIconForMilestone(milestone.milestone.name)} color='gray' size={16} />
              </View>
            )}
          </Animated.View>
        </View>
      )
    },
    [currentMilestone, pulseAnim]
  )

  return (
    <View className='pt-2'>
      <ScrollView
        ref={scrollViewRef}
        className='flex-1'
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={handleScrollViewLayout}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        decelerationRate='fast'
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      >
        <View className='flex-row items-center py-2'>
          {orderItemMilestones.map((milestone, index) => (
            <View
              key={milestone.milestone.id}
              className='flex-row'
              onLayout={(event) => handleStageLayout(milestone.milestone.id, event)}
            >
              <View className='items-center gap-2' style={{ width: STAGE_WIDTH }}>
                {renderMilestoneIcon(milestone, index)}
              </View>
              {index !== orderItemMilestones.length - 1 ? (
                <View className='h-1.5 w-12 mt-[16px] rounded-full bg-muted overflow-hidden'>
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
                      width: progressAnims.current[index]?.interpolate({
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
      <View className='mt-2 gap-0.5 pt-2'>
        {completedMilestones && Array.isArray(completedMilestones)
          ? completedMilestones.map((milestone) => (
              <View key={milestone.milestone.id} className='flex-row items-center gap-2'>
                <View className='flex-row items-center gap-2 flex-1'>
                  {milestone.progress === 100 && milestone.isDone ? (
                    <View className='w-2 h-2 rounded-full bg-emerald-400' />
                  ) : null}
                  {milestone.progress === 100 && !milestone.isDone ? (
                    <View className='w-2 h-2 rounded-full bg-rose-400' />
                  ) : null}
                  <Text className='text-[12px] font-inter-medium flex-1' numberOfLines={1}>
                    {milestone.milestone.name}
                  </Text>
                </View>
                {milestone?.milestone.name === 'Order Placed' ? (
                  <Text className='text-[10px] text-muted-foreground/50 text-right'>
                    {orderPlacedAt ? format(new Date(orderPlacedAt), "MMM dd, yyyy 'at' hh:mm a") : null}
                  </Text>
                ) : milestone.progress === 100 && milestone.isDone ? (
                  <MaterialCommunityIcons name='check' size={16} color='lightgray' />
                ) : milestone.progress === 100 && !milestone.isDone ? (
                  <MaterialCommunityIcons name='cancel' size={16} color='lightgray' />
                ) : null}
              </View>
            ))
          : null}
        {currentMilestone ? (
          <View className='flex-row items-center gap-2'>
            <View className='flex-row items-center gap-2 flex-1'>
              <View className='w-2 h-2 rounded-full' style={{ backgroundColor: '#fb923c' }} />
              <Text className='text-[12px] font-inter-medium flex-1' numberOfLines={1}>
                {currentMilestone?.milestone?.name}
              </Text>
            </View>
            <Text className='text-[10px] text-muted-foreground'>{currentMilestone?.currentTask?.name || ''}</Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}
