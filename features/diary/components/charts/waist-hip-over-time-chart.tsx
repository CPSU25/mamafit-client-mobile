import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { ActivityIndicator, useWindowDimensions, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { useGetDiaryDetail } from '~/features/diary/hooks/use-get-diary-detail'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { Measurement } from '~/types/diary.type'
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

interface WaistHipOverTimeChartProps {
  currentWeekData: Measurement | null | undefined
  diaryId: string
  onRefetchReady?: (refetch: () => Promise<any>) => void
}

// Waist-Hip chart specific constants
const WAIST_HIP_CHART_CONSTANTS = {
  MAX_VALUE: 200,
  END_SPACING: 25
} as const

const WAIST_HIP_CHART_COLORS = {
  STRIP: '#3b82f6',
  WAIST: {
    primary: '#f97316',
    secondary: '#fdba74',
    light: '#fff7ed'
  },
  HIP: {
    primary: '#3b82f6',
    secondary: '#93c5fd',
    light: '#f0f9ff'
  }
} as const

const createCustomDataPoint = (type: 'waist' | 'hip') => (
  <View
    style={{
      width: SHARED_CHART_CONSTANTS.DATA_POINT_SIZE,
      height: SHARED_CHART_CONSTANTS.DATA_POINT_SIZE,
      backgroundColor: type === 'waist' ? WAIST_HIP_CHART_COLORS.WAIST.primary : WAIST_HIP_CHART_COLORS.HIP.primary,
      borderWidth: 3,
      borderRadius: SHARED_CHART_CONSTANTS.DATA_POINT_SIZE / 2,
      borderColor: type === 'waist' ? WAIST_HIP_CHART_COLORS.WAIST.primary : WAIST_HIP_CHART_COLORS.HIP.primary,
      shadowColor: type === 'waist' ? WAIST_HIP_CHART_COLORS.WAIST.primary : WAIST_HIP_CHART_COLORS.HIP.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5
    }}
  />
)

const createWeekLabel = (week: string) => (
  <Text className='text-xs text-muted-foreground ml-[14px]'>{parseInt(week) >= 1 ? `W${week}` : 'N/A'}</Text>
)

const createPointerLabelComponent = (items: any) => (
  <Card className='w-[80px] items-center p-2'>
    <View className='flex flex-col items-center gap-1'>
      <View className='flex flex-row items-center gap-1'>
        <View className='w-2 h-2 rounded-full' style={{ backgroundColor: WAIST_HIP_CHART_COLORS.HIP.primary }} />
        <Text className='font-inter-semibold text-xs' style={{ color: WAIST_HIP_CHART_COLORS.HIP.primary }}>
          {items[1]?.value === SHARED_CHART_CONSTANTS.PLACEHOLDER_VALUE ? 'N/A' : items[1]?.value || 0} cm
        </Text>
      </View>
      <View className='flex flex-row items-center gap-1'>
        <View className='w-2 h-2 rounded-full' style={{ backgroundColor: WAIST_HIP_CHART_COLORS.WAIST.primary }} />
        <Text className='font-inter-semibold text-xs' style={{ color: WAIST_HIP_CHART_COLORS.WAIST.primary }}>
          {items[0]?.value === SHARED_CHART_CONSTANTS.PLACEHOLDER_VALUE ? 'N/A' : items[0]?.value || 0} cm
        </Text>
      </View>
    </View>
  </Card>
)

export default function WaistHipOverTimeChart({
  currentWeekData,
  diaryId,
  onRefetchReady
}: WaistHipOverTimeChartProps) {
  const [offsetHaW, setOffsetHaW] = useState(0)
  const { width } = useWindowDimensions()
  const { startDate, endDate } = getFiveWeeksRange(offsetHaW)

  const {
    data: fiveWeeksHaWData,
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

  const chartWidth = calculateChartWidth(width)
  const dateRange = formatDateRange(startDate, endDate)

  const waistData = processGenericChartData({
    measurements: fiveWeeksHaWData?.measurements,
    currentWeek: currentWeekData?.weekOfPregnancy || 0,
    stripColor: WAIST_HIP_CHART_COLORS.STRIP,
    getValue: (measurement) => measurement.waist,
    createCustomDataPoint: () => createCustomDataPoint('waist'),
    createWeekLabel,
    status: offsetHaW >= 0 ? 'next' : 'prev',
    isLoading
  })

  const hipData = processGenericChartData({
    measurements: fiveWeeksHaWData?.measurements,
    currentWeek: currentWeekData?.weekOfPregnancy || 0,
    stripColor: WAIST_HIP_CHART_COLORS.STRIP,
    getValue: (measurement) => measurement.hip,
    createCustomDataPoint: () => createCustomDataPoint('hip'),
    createWeekLabel,
    status: offsetHaW >= 0 ? 'next' : 'prev',
    isLoading
  })
  const dynamicSpacing = calculateDynamicSpacing(chartWidth, waistData.length)
  const baseChartConfig = getBaseChartConfig(chartWidth)
  const basePointerConfig = getBasePointerConfig()

  const handleNavigation = (direction: 'prev' | 'next') => {
    setOffsetHaW((prev) => (direction === 'prev' ? prev - 1 : prev + 1))
  }

  return (
    <Card className='flex flex-col gap-4 p-4 mt-1 rounded-xl flex-1'>
      {/* Header Section */}
      <View className='flex flex-row justify-between items-start'>
        <View className='text-left'>
          <Text className='font-inter-medium text-sm'>Tỉ lệ vòng eo & vòng hông</Text>
          <View className='flex flex-row items-baseline gap-2 mt-1'>
            {currentWeekData?.waist ? (
              <Text className='font-inter-extrabold text-2xl' style={{ color: WAIST_HIP_CHART_COLORS.WAIST.primary }}>
                {currentWeekData?.waist.toFixed(1)} cm
              </Text>
            ) : (
              <Text className='font-inter-extrabold text-2xl' style={{ color: WAIST_HIP_CHART_COLORS.WAIST.primary }}>
                N/A
              </Text>
            )}
            {currentWeekData?.hip ? (
              <Text className='font-inter-extrabold text-2xl' style={{ color: WAIST_HIP_CHART_COLORS.HIP.primary }}>
                {currentWeekData?.hip.toFixed(1)} cm
              </Text>
            ) : (
              <Text className='font-inter-extrabold text-2xl' style={{ color: WAIST_HIP_CHART_COLORS.HIP.primary }}>
                N/A
              </Text>
            )}
          </View>
          <Text className='text-xs text-muted-foreground'>Số đo tuần này</Text>
        </View>

        {/* Navigation Buttons */}
        <View className='flex flex-row items-center gap-2'>
          <Button size='icon' variant='outline' onPress={() => handleNavigation('prev')} disabled={isLoading}>
            <Feather name='chevron-left' size={24} color={WAIST_HIP_CHART_COLORS.WAIST.primary} />
          </Button>
          <Button size='icon' variant='outline' onPress={() => handleNavigation('next')} disabled={isLoading}>
            <Feather name='chevron-right' size={24} color={WAIST_HIP_CHART_COLORS.HIP.primary} />
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
            key={`waist-hip-chart-${fiveWeeksHaWData?.measurements?.length || 0}`}
            maxValue={WAIST_HIP_CHART_CONSTANTS.MAX_VALUE}
            color={WAIST_HIP_CHART_COLORS.WAIST.primary}
            color2={WAIST_HIP_CHART_COLORS.HIP.primary}
            areaChart
            data={waistData}
            data2={hipData}
            spacing={dynamicSpacing}
            endSpacing={WAIST_HIP_CHART_CONSTANTS.END_SPACING}
            startFillColor={WAIST_HIP_CHART_COLORS.WAIST.primary}
            startFillColor2={WAIST_HIP_CHART_COLORS.HIP.primary}
            endFillColor={WAIST_HIP_CHART_COLORS.WAIST.light}
            endFillColor2={WAIST_HIP_CHART_COLORS.HIP.light}
            startOpacity={0.4}
            endOpacity={0.1}
            pointerConfig={{
              ...basePointerConfig,
              pointerStripColor: WAIST_HIP_CHART_COLORS.HIP.primary,
              pointerColor: WAIST_HIP_CHART_COLORS.WAIST.primary,
              pointer2Color: WAIST_HIP_CHART_COLORS.HIP.primary,
              pointerLabelComponent: createPointerLabelComponent
            }}
          />
        )}

        {/* Legend Section */}
        <View className='flex flex-row items-center justify-center gap-6'>
          <View className='flex flex-row items-center gap-2'>
            <View className='w-3 h-3 rounded-full' style={{ backgroundColor: WAIST_HIP_CHART_COLORS.WAIST.primary }} />
            <Text className='text-xs font-inter-medium text-muted-foreground'>Vòng Eo</Text>
          </View>
          <View className='flex flex-row items-center gap-2'>
            <View className='w-3 h-3 rounded-full' style={{ backgroundColor: WAIST_HIP_CHART_COLORS.HIP.primary }} />
            <Text className='text-xs font-inter-medium text-muted-foreground'>Vòng Hông</Text>
          </View>
        </View>

        {/* Footer Information */}
        <View className='flex flex-col items-center gap-1'>
          <Text className='font-inter-medium text-center text-sm'>{dateRange}</Text>
          <Text className='text-xs text-muted-foreground text-center'>Nhấn và giữ trên biểu đồ để xem dữ liệu</Text>
        </View>
      </View>
    </Card>
  )
}
