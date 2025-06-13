import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CurrentMeasurementsCard from '~/components/card/current-measurements-card'
import { Text } from '~/components/ui/text'
import WeightOverTimeChart from '~/features/diary/chart/weight-over-time-chart'

export default function MeasurementDiaryDetailScreen() {
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='flex flex-col gap-4 p-4'>
          <View className='flex flex-col gap-1'>
            <Text className='text-xl font-inter-semibold'>Current Body Measurements</Text>
            <Text className='text-muted-foreground text-xs'>
              You can edit measurements only in the current week. Previous weeks&apos; data cannot be changed.
            </Text>
          </View>
          <CurrentMeasurementsCard />
          <WeightOverTimeChart />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
