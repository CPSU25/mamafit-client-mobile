import WeightOverTimeChart from '~/features/diary/chart/weight-over-time-chart'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MeasurementDiaryDetailScreen() {
  return (
    <SafeAreaView className='flex-1'>
      <View className='p-4'>
        <WeightOverTimeChart />
      </View>
    </SafeAreaView>
  )
}
