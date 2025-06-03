import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'

// const data: barDataItem[] = [
//   { value: 50, label: 'W1', gradientColor: '#6d28d9', frontColor: '#bb85f3' },
//   { value: 29, label: 'W2', gradientColor: '#6d28d9', frontColor: '#bb85f3' },
//   { value: 30, label: 'W3', gradientColor: '#6d28d9', frontColor: '#bb85f3' },
//   { value: 19, label: 'W4', gradientColor: '#6d28d9', frontColor: '#bb85f3' }
// ]

export default function MeasurementDiaryDetailScreen() {
  return (
    <SafeAreaView>
      <Text>MeasurementDiaryDetailScreen</Text>
      <View className='p-4'>
        {/* <Card className={`p-4 ${shadowClassName} ${containerClassName}`}>
          <BarChart
            data={chartData}
            height={200}
            width={250}
            barWidth={30}
            minHeight={3}
            barBorderRadius={6}
            showGradient
            spacing={30}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={{ color: 'gray' }}
            yAxisTextStyle={{ color: 'gray' }}
            isAnimated
            animationDuration={1000}
          />
        </Card> */}
      </View>
    </SafeAreaView>
  )
}
