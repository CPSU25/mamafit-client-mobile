import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns'
import { lineDataItem } from 'react-native-gifted-charts'
import { Measurement } from '~/types/diary.type'

const WEEK_CONFIG = {
  WEEKS_BEFORE: 3,
  WEEKS_AFTER: 1,
  WEEK_STARTS_ON: 1
} as const

const OFFSET_WEEKS = 5

export const SHARED_CHART_CONSTANTS = {
  MIN_DATA_POINTS: 5,
  PLACEHOLDER_VALUE: 3,
  DATA_POINT_SIZE: 16,
  CHART_THICKNESS: 3,
  MAX_VALUE: 200,
  SECTIONS: 4,
  INITIAL_SPACING: 20,
  CHART_PADDING: 135,
  STRIP_HEIGHT: 200,
  STRIP_WIDTH: 2,
  POINTER_STRIP_WIDTH: 1,
  POINTER_RADIUS: 6,
  POINTER_LABEL_WIDTH: 80,
  POINTER_LABEL_HEIGHT: 55,
  ANIMATION_DURATION: 1000,
  DATA_CHANGE_ANIMATION_DURATION: 800
} as const

export const SHARED_CHART_COLORS = {
  RULES: '#9ca3af',
  Y_AXIS: '#374151',
  Y_AXIS_TEXT: '#9ca3af'
} as const

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = format(new Date(startDate), 'dd MMM yyyy')
  const end = format(new Date(endDate), 'dd MMM yyyy')
  return `${start} - ${end}`
}

export const sortMeasurementsByWeek = (measurements: Measurement[] | undefined): Measurement[] => {
  if (!measurements) return []
  return measurements.sort((a, b) => a.weekOfPregnancy - b.weekOfPregnancy)
}

export const addPlaceholderDataPoints = (
  data: lineDataItem[],
  status: 'prev' | 'next',
  measurements: Measurement[] | undefined,
  minDataPoints: number = SHARED_CHART_CONSTANTS.MIN_DATA_POINTS,
  createPlaceholder: (weekNumber: number) => lineDataItem
): lineDataItem[] => {
  if (data.length >= minDataPoints) {
    return data
  }

  const firstWeek = measurements?.[0]?.weekOfPregnancy || 0
  const lastWeek = measurements?.[measurements.length - 1]?.weekOfPregnancy || 0
  const placeholdersNeeded = minDataPoints - data.length

  const placeholders = Array.from({ length: placeholdersNeeded }, (_, index) =>
    createPlaceholder(
      status === 'prev' ? (firstWeek - index - 1 <= 0 ? 0 : firstWeek - index - 1) : lastWeek + index + 1
    )
  )

  if (status === 'prev') {
    return [...placeholders.reverse(), ...data]
  }

  return [...data, ...placeholders]
}

export const generateEmptyDataPoints = (
  count: number = SHARED_CHART_CONSTANTS.MIN_DATA_POINTS,
  createPlaceholder: (weekNumber: number) => lineDataItem
): lineDataItem[] => {
  return Array.from({ length: count }, (_, index) => createPlaceholder(index + 1))
}

export const calculateChartWidth = (
  screenWidth: number,
  padding: number = SHARED_CHART_CONSTANTS.CHART_PADDING
): number => {
  return screenWidth - padding
}

export const calculateDynamicSpacing = (chartWidth: number, dataLength: number, offset: number = 10): number => {
  return chartWidth / (dataLength - 1) - offset
}

export const getBaseChartConfig = (chartWidth: number) => ({
  isAnimated: true,
  animationDuration: SHARED_CHART_CONSTANTS.ANIMATION_DURATION,
  animateOnDataChange: true,
  onDataChangeAnimationDuration: SHARED_CHART_CONSTANTS.DATA_CHANGE_ANIMATION_DURATION,
  thickness: SHARED_CHART_CONSTANTS.CHART_THICKNESS,
  maxValue: SHARED_CHART_CONSTANTS.MAX_VALUE,
  noOfSections: SHARED_CHART_CONSTANTS.SECTIONS,
  width: chartWidth,
  initialSpacing: SHARED_CHART_CONSTANTS.INITIAL_SPACING,
  backgroundColor: 'transparent' as const,
  hideRules: false,
  rulesColor: SHARED_CHART_COLORS.RULES,
  rulesType: 'dashed' as const,
  xAxisThickness: 0,
  yAxisThickness: 0,
  yAxisColor: SHARED_CHART_COLORS.Y_AXIS,
  yAxisTextStyle: {
    color: SHARED_CHART_COLORS.Y_AXIS_TEXT,
    fontSize: 10,
    fontFamily: 'Inter-SemiBold'
  },
  dataPointsHeight: SHARED_CHART_CONSTANTS.DATA_POINT_SIZE,
  dataPointsWidth: SHARED_CHART_CONSTANTS.DATA_POINT_SIZE
})

export const getBasePointerConfig = () => ({
  pointerStripHeight: SHARED_CHART_CONSTANTS.STRIP_HEIGHT,
  pointerStripWidth: SHARED_CHART_CONSTANTS.POINTER_STRIP_WIDTH,
  strokeDashArray: [4, 6] as [number, number],
  radius: SHARED_CHART_CONSTANTS.POINTER_RADIUS,
  pointerLabelWidth: SHARED_CHART_CONSTANTS.POINTER_LABEL_WIDTH,
  pointerLabelHeight: SHARED_CHART_CONSTANTS.POINTER_LABEL_HEIGHT,
  activatePointersInstantlyOnTouch: true,
  autoAdjustPointerLabelPosition: true
})

export const createBaseDataPoint = (
  value: number,
  stripColor: string,
  isCurrentWeek: boolean,
  customDataPoint: () => any,
  labelComponent: () => any
): lineDataItem => {
  const baseDataPoint: lineDataItem = {
    value,
    hideDataPoint: false,
    customDataPoint,
    labelComponent
  }

  if (isCurrentWeek) {
    return {
      ...baseDataPoint,
      showStrip: true,
      stripHeight: SHARED_CHART_CONSTANTS.STRIP_HEIGHT,
      stripWidth: SHARED_CHART_CONSTANTS.STRIP_WIDTH,
      stripColor,
      stripOpacity: 0.8
    }
  }

  return baseDataPoint
}

export const processGenericChartData = ({
  measurements,
  currentWeek,
  stripColor,
  getValue,
  createCustomDataPoint,
  createWeekLabel,
  status,
  isLoading
}: {
  measurements: Measurement[] | undefined
  currentWeek: number
  stripColor: string
  getValue: (measurement: Measurement) => number
  createCustomDataPoint: () => any
  createWeekLabel: (week: string) => any
  status: 'prev' | 'next'
  isLoading: boolean
}): lineDataItem[] => {
  const data: lineDataItem[] = []

  if (!isLoading && !measurements?.length) {
    return generateEmptyDataPoints(SHARED_CHART_CONSTANTS.MIN_DATA_POINTS, (weekNumber) => ({
      value: SHARED_CHART_CONSTANTS.PLACEHOLDER_VALUE,
      hideDataPoint: true,
      labelComponent: () => createWeekLabel('N/A')
    }))
  }

  const sortedMeasurements = sortMeasurementsByWeek(measurements)

  sortedMeasurements.forEach((measurement) => {
    const dataPoint = createBaseDataPoint(
      getValue(measurement),
      stripColor,
      measurement.weekOfPregnancy === currentWeek,
      createCustomDataPoint,
      () => createWeekLabel(measurement.weekOfPregnancy.toString())
    )
    data.push(dataPoint)
  })

  return addPlaceholderDataPoints(data, status, measurements, SHARED_CHART_CONSTANTS.MIN_DATA_POINTS, (weekNumber) => ({
    value: SHARED_CHART_CONSTANTS.PLACEHOLDER_VALUE,
    hideDataPoint: true,
    labelComponent: () => createWeekLabel(weekNumber.toString())
  }))
}

export const getFiveWeeksRange = (offset: number = 0) => {
  const baseStartDate = startOfWeek(subWeeks(new Date(), WEEK_CONFIG.WEEKS_BEFORE), {
    weekStartsOn: WEEK_CONFIG.WEEK_STARTS_ON
  }).toISOString()
  const baseEndDate = endOfWeek(addWeeks(new Date(), WEEK_CONFIG.WEEKS_AFTER), {
    weekStartsOn: WEEK_CONFIG.WEEK_STARTS_ON
  }).toISOString()

  const offsetStartDate = addWeeks(baseStartDate, offset * OFFSET_WEEKS)
  const offsetEndDate = addWeeks(baseEndDate, offset * OFFSET_WEEKS)

  return {
    startDate: offsetStartDate.toISOString(),
    endDate: offsetEndDate.toISOString()
  }
}

export const getCurrentWeekRange = () => ({
  startDate: startOfWeek(new Date(), { weekStartsOn: WEEK_CONFIG.WEEK_STARTS_ON }).toISOString(),
  endDate: endOfWeek(new Date(), { weekStartsOn: WEEK_CONFIG.WEEK_STARTS_ON }).toISOString()
})
