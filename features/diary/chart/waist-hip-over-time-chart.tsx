import { Feather } from '@expo/vector-icons'
import { Text, useWindowDimensions, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { getShadowStyles, styles } from '~/lib/constants/constants'

const CHART_COLORS = {
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
}

const customDataPoint = (color: string) => {
  return (
    <View
      style={{
        width: 16,
        height: 16,
        backgroundColor: 'white',
        borderWidth: 3,
        borderRadius: 8,
        borderColor: color,
        shadowColor: color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10
      }}
    />
  )
}

const customLabel = (val: string) => {
  return <Text className='text-xs text-muted-foreground ml-[14px]'>{val}</Text>
}

const waistData = [
  {
    value: 60,
    hideDataPoint: true,
    labelComponent: () => customLabel('W1')
  },
  {
    value: 63.5,
    hideDataPoint: true,
    labelComponent: () => customLabel('W2')
  },
  {
    value: 70,
    hideDataPoint: true,
    labelComponent: () => customLabel('W3')
  },
  {
    value: 72.3,
    hideDataPoint: true,
    labelComponent: () => customLabel('W4')
  },
  {
    value: 75,
    customDataPoint: () => customDataPoint(CHART_COLORS.WAIST.primary),
    showStrip: true,
    stripHeight: 200,
    stripWidth: 2,
    stripColor: CHART_COLORS.WAIST.primary,
    stripOpacity: 0.8,
    labelComponent: () => customLabel('W5')
  },
  {
    value: 68,
    hideDataPoint: true,
    labelComponent: () => customLabel('W6')
  }
]

const hipData = [
  {
    value: 85,
    hideDataPoint: true,
    labelComponent: () => customLabel('W1')
  },
  {
    value: 87.5,
    hideDataPoint: true,
    labelComponent: () => customLabel('W2')
  },
  {
    value: 90,
    hideDataPoint: true,
    labelComponent: () => customLabel('W3')
  },
  {
    value: 88.3,
    hideDataPoint: true,
    labelComponent: () => customLabel('W4')
  },
  {
    value: 92,
    customDataPoint: () => customDataPoint(CHART_COLORS.HIP.primary),
    showStrip: true,
    stripHeight: 200,
    stripWidth: 2,
    stripColor: CHART_COLORS.HIP.primary,
    stripOpacity: 0.8,
    labelComponent: () => customLabel('W5')
  },
  {
    value: 89,
    hideDataPoint: true,
    labelComponent: () => customLabel('W6')
  }
]

export default function WaistHipOverTimeChart() {
  const { width } = useWindowDimensions()

  return (
    <Card className='flex flex-col gap-4 p-4 mt-1'>
      <View className='flex flex-row justify-between items-start'>
        <View className='text-left'>
          <Text className='font-inter-medium text-sm text-foreground'>Your Waist & Hip Over Time</Text>
          <View className='flex flex-row items-baseline gap-2 mt-1'>
            <Text className='font-inter-extrabold text-2xl' style={{ color: CHART_COLORS.WAIST.primary }}>
              75.0 cm
            </Text>
            <Text className='font-inter-extrabold text-2xl' style={{ color: CHART_COLORS.HIP.primary }}>
              92.0 cm
            </Text>
          </View>
          <Text className='text-xs text-muted-foreground'>This week&apos;s measurements</Text>
        </View>
        <View className='flex flex-row items-center gap-2'>
          <Button size='icon' variant='outline'>
            <Feather name='chevron-left' size={24} color={CHART_COLORS.WAIST.primary} />
          </Button>
          <Button size='icon' variant='outline'>
            <Feather name='chevron-right' size={24} color={CHART_COLORS.HIP.primary} />
          </Button>
        </View>
      </View>

      <View className='gap-6 mt-2'>
        <LineChart
          isAnimated
          animationDuration={1500}
          animateOnDataChange
          onDataChangeAnimationDuration={800}
          thickness={3}
          color={CHART_COLORS.WAIST.primary}
          color2={CHART_COLORS.HIP.primary}
          maxValue={150}
          noOfSections={4}
          width={width - 120}
          areaChart
          curved
          data={waistData}
          data2={hipData}
          spacing={(width - 180) / (waistData.length - 1)}
          initialSpacing={16}
          endSpacing={25}
          startFillColor={CHART_COLORS.WAIST.primary}
          startFillColor2={CHART_COLORS.HIP.primary}
          endFillColor={CHART_COLORS.WAIST.light}
          endFillColor2={CHART_COLORS.HIP.light}
          startOpacity={0.4}
          endOpacity={0.1}
          backgroundColor='transparent'
          hideRules={false}
          rulesColor='#374151'
          rulesType='dashed'
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisColor='#374151'
          yAxisTextStyle={{ color: '#9ca3af', fontSize: 10, fontFamily: 'Inter-SemiBold' }}
          dataPointsHeight={16}
          dataPointsWidth={16}
          pointerConfig={{
            pointerStripHeight: 200,
            pointerStripColor: CHART_COLORS.HIP.primary,
            pointerStripWidth: 1,
            pointerColor: CHART_COLORS.WAIST.primary,
            pointer2Color: CHART_COLORS.HIP.primary,
            strokeDashArray: [4, 6],
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 70,
            activatePointersInstantlyOnTouch: true,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: any) => {
              return (
                <Card className='w-[80px] items-center p-2' style={[styles.container, getShadowStyles()]}>
                  <View className='flex flex-col items-center gap-1'>
                    <View className='flex flex-row items-center gap-1'>
                      <View className='w-2 h-2 rounded-full' style={{ backgroundColor: CHART_COLORS.HIP.primary }} />
                      <Text className='font-inter-semibold text-xs' style={{ color: CHART_COLORS.HIP.primary }}>
                        {items[1]?.value || 0} cm
                      </Text>
                    </View>
                    <View className='flex flex-row items-center gap-1'>
                      <View className='w-2 h-2 rounded-full' style={{ backgroundColor: CHART_COLORS.WAIST.primary }} />
                      <Text className='font-inter-semibold text-xs' style={{ color: CHART_COLORS.WAIST.primary }}>
                        {items[0]?.value || 0} cm
                      </Text>
                    </View>
                  </View>
                </Card>
              )
            }
          }}
        />

        <View className='flex flex-row items-center justify-center gap-6 mt-2'>
          <View className='flex flex-row items-center gap-2'>
            <View className='w-3 h-3 rounded-full' style={{ backgroundColor: CHART_COLORS.WAIST.primary }} />
            <Text className='text-xs font-inter-medium text-muted-foreground'>Waist</Text>
          </View>
          <View className='flex flex-row items-center gap-2'>
            <View className='w-3 h-3 rounded-full' style={{ backgroundColor: CHART_COLORS.HIP.primary }} />
            <Text className='text-xs font-inter-medium text-muted-foreground'>Hip</Text>
          </View>
        </View>

        <Text className='text-xs text-muted-foreground text-center'>Press and hold on the chart to see the data</Text>
      </View>
    </Card>
  )
}
