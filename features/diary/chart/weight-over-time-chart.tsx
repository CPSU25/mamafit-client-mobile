import { Feather } from '@expo/vector-icons'
import { Text, useWindowDimensions, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { getShadowStyles, PRIMARY_COLOR, styles } from '~/lib/constants/constants'

const customDataPoint = () => {
  return (
    <View
      style={{
        width: 16,
        height: 16,
        backgroundColor: 'white',
        borderWidth: 3,
        borderRadius: 8,
        borderColor: '#8b5cf6',
        shadowColor: '#8b5cf6',
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
  return <Text className='text-xs text-muted-foreground ml-4'>{val}</Text>
}

const data = [
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
    customDataPoint: customDataPoint,
    showStrip: true,
    stripHeight: 200,
    stripWidth: 2,
    stripColor: '#6d28d9',
    stripOpacity: 0.8,
    labelComponent: () => customLabel('W5')
  },
  {
    value: 10,
    hideDataPoint: true,
    labelComponent: () => customLabel('W6')
  }
]

export default function WeightOverTimeChart() {
  const { width } = useWindowDimensions()

  return (
    <Card className='flex flex-col gap-4 p-4 mt-1'>
      <View className='flex flex-row justify-between items-start'>
        <View className='text-left'>
          <Text className='font-inter-medium text-sm text-foreground'>Your Weight Over Time</Text>
          <Text className='font-inter-extrabold text-2xl text-primary mt-1'>75.00 kg</Text>
          <Text className='text-xs text-muted-foreground'>This week&apos;s weight</Text>
        </View>
        <View className='flex flex-row items-center gap-2'>
          <Button size='icon' variant='outline'>
            <Feather name='chevron-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </Button>
          <Button size='icon' variant='outline'>
            <Feather name='chevron-right' size={24} color={PRIMARY_COLOR.LIGHT} />
          </Button>
        </View>
      </View>

      <View className='gap-6 mt-2'>
        <LineChart
          isAnimated
          animationDuration={1500}
          animateOnDataChange
          onDataChangeAnimationDuration={800}
          thickness={2}
          color='#a964ff'
          maxValue={200}
          noOfSections={4}
          width={width - 130}
          curved
          data={data}
          spacing={(width - 180) / (data.length - 1)}
          initialSpacing={18}
          startOpacity={0.6}
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
            pointerStripColor: '#6d28d9',
            pointerStripWidth: 1,
            pointerColor: '#6d28d9',
            strokeDashArray: [4, 6],
            radius: 6,
            pointerLabelWidth: 80,
            pointerLabelHeight: 45,
            activatePointersInstantlyOnTouch: true,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: any) => {
              return (
                <Card className='w-20 items-center py-1' style={[styles.container, getShadowStyles()]}>
                  <Text className='font-inter-semibold text-primary text-sm py-0.5'>
                    {items[0]?.value === 10 ? 'N/A' : items[0]?.value || 0}
                    <Text className='text-xs text-muted-foreground font-inter-medium'> kg</Text>
                  </Text>
                </Card>
              )
            }
          }}
        />
        <Text className='text-xs text-muted-foreground text-center'>Press and hold on the chart to see the data</Text>
      </View>
    </Card>
  )
}
