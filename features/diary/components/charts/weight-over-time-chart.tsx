import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Text, useWindowDimensions, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { useGetDiaryDetail } from '~/features/diary/hooks'
import {
  calculateChartWidth,
  calculateDynamicSpacing,
  formatDateRange,
  getBaseChartConfig,
  getBasePointerConfig,
  getFiveWeeksRange,
  processGenericChartData,
  SHARED_CHART_CONSTANTS
} from './chart-utils'

interface WeightOverTimeChartProps {
  currentWeek: number
  currentWeight: number
  diaryId: string
  onRefetchReady?: (refetch: () => Promise<any>) => void
}

const WEIGHT_CHART_COLORS = {
  LINE: '#a964ff',
  STRIP: '#6d28d9',
  POINTER: '#6d28d9',
  DATA_POINT_BORDER: '#8b5cf6',
  DATA_POINT_BACKGROUND: '#8b5cf6',
  DATA_POINT_SHADOW: '#8b5cf6'
} as const

const createCustomDataPoint = () => (
  <View
    style={{
      width: SHARED_CHART_CONSTANTS.DATA_POINT_SIZE,
      height: SHARED_CHART_CONSTANTS.DATA_POINT_SIZE,
      backgroundColor: WEIGHT_CHART_COLORS.DATA_POINT_BACKGROUND,
      borderWidth: 3,
      borderRadius: SHARED_CHART_CONSTANTS.DATA_POINT_SIZE / 2,
      borderColor: WEIGHT_CHART_COLORS.DATA_POINT_BORDER,
      shadowColor: WEIGHT_CHART_COLORS.DATA_POINT_SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5
    }}
  />
)

const createWeekLabel = (week: string) => (
  <Text className='text-xs text-muted-foreground ml-[16px]'>{parseInt(week) >= 1 ? `W${week}` : 'N/A'}</Text>
)

const createPointerLabelComponent = (items: any) => (
  <Card className='w-20 items-center py-1'>
    <Text className='font-inter-semibold text-primary text-sm py-0.5'>
      {items[0]?.value === SHARED_CHART_CONSTANTS.PLACEHOLDER_VALUE ? 'N/A' : items[0]?.value || 0}
      <Text className='text-xs text-muted-foreground font-inter-medium'> kg</Text>
    </Text>
  </Card>
)

export default function WeightOverTimeChart({
  currentWeek,
  currentWeight,
  diaryId,
  onRefetchReady
}: WeightOverTimeChartProps) {
  const [offsetWeight, setOffsetWeight] = useState(0)
  const { startDate, endDate } = getFiveWeeksRange(offsetWeight)

  const {
    data: fiveWeeksWeightData,
    isLoading,
    refetch
  } = useGetDiaryDetail({
    diaryId,
    startDate,
    endDate
  })

  useEffect(() => {
    if (onRefetchReady) {
      onRefetchReady(refetch)
    }
  }, [refetch, onRefetchReady])

  const { width } = useWindowDimensions()

  const chartWidth = calculateChartWidth(width)
  const dateRange = formatDateRange(startDate, endDate)
  const chartData = processGenericChartData({
    measurements: fiveWeeksWeightData?.measurements,
    currentWeek,
    stripColor: WEIGHT_CHART_COLORS.STRIP,
    getValue: (measurement) => measurement.weight,
    createCustomDataPoint,
    createWeekLabel,
    status: offsetWeight >= 0 ? 'next' : 'prev',
    isLoading
  })

  const dynamicSpacing = calculateDynamicSpacing(chartWidth, chartData.length)
  const baseChartConfig = getBaseChartConfig(chartWidth)
  const basePointerConfig = getBasePointerConfig()

  const handleNavigation = (direction: 'prev' | 'next') => {
    setOffsetWeight((prev) => (direction === 'prev' ? prev - 1 : prev + 1))
  }

  return (
    <Card className='flex flex-col gap-4 p-4 mt-1 rounded-xl flex-1'>
      {/* Header Section */}
      <View className='flex flex-row justify-between items-start'>
        <View className='text-left'>
          <Text className='font-inter-medium text-sm text-foreground'>Your Weight Over Time</Text>
          <Text className='font-inter-extrabold text-2xl text-primary mt-1'>{currentWeight.toFixed(2)} kg</Text>
          <Text className='text-xs text-muted-foreground'>This week&apos;s weight</Text>
        </View>

        {/* Navigation Buttons */}
        <View className='flex flex-row items-center gap-2'>
          <Button size='icon' variant='outline' onPress={() => handleNavigation('prev')}>
            <Feather name='chevron-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </Button>
          <Button size='icon' variant='outline' onPress={() => handleNavigation('next')}>
            <Feather name='chevron-right' size={24} color={PRIMARY_COLOR.LIGHT} />
          </Button>
        </View>
      </View>

      {/* Chart Section */}
      <View className='flex-1 gap-6 mt-2'>
        {isLoading ? (
          <ActivityIndicator size='large' color={PRIMARY_COLOR.LIGHT} className='flex-1' />
        ) : (
          <LineChart
            {...baseChartConfig}
            key={`weight-chart-${fiveWeeksWeightData?.measurements?.length || 0}`}
            color={WEIGHT_CHART_COLORS.LINE}
            data={chartData}
            spacing={dynamicSpacing}
            startOpacity={0.6}
            endOpacity={0.1}
            pointerConfig={{
              ...basePointerConfig,
              pointerStripColor: WEIGHT_CHART_COLORS.POINTER,
              pointerColor: WEIGHT_CHART_COLORS.POINTER,
              pointerLabelComponent: createPointerLabelComponent
            }}
          />
        )}

        {/* Footer Information */}
        <View className='flex flex-col items-center gap-1'>
          <Text className='font-inter-medium text-center text-sm text-foreground'>{dateRange}</Text>
          <Text className='text-xs text-muted-foreground text-center'>Press and hold on the chart to see the data</Text>
        </View>
      </View>
    </Card>
  )
}
