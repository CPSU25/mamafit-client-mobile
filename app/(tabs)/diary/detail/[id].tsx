import { useState } from 'react'
import { FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CurrentMeasurementsCard from '~/components/card/current-measurements-card'
import MeasurementCard from '~/components/card/measurement-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import WaistHipOverTimeChart from '~/features/diary/chart/waist-hip-over-time-chart'
import WeightOverTimeChart from '~/features/diary/chart/weight-over-time-chart'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

const measurements = [1, 2, 3, 4, 5]

export default function MeasurementDiaryDetailScreen() {
  const [tabValue, setTabValue] = useState('chart1')

  return (
    <SafeAreaView className='flex-1'>
      <FlatList
        data={measurements}
        ListHeaderComponent={
          <View className='flex flex-col gap-4'>
            <View className='flex flex-col gap-1'>
              <View className='flex flex-row items-center gap-2'>
                {SvgIcon.calendar({ size: ICON_SIZE.EXTRA_SMALL, color: 'PRIMARY' })}
                <Text className='text-xl font-inter-semibold'>Current Week - 28</Text>
              </View>

              <Text className='text-muted-foreground text-xs'>
                You can edit measurements only in the current week. Previous weeks&apos; data cannot be changed.
              </Text>
            </View>

            <CurrentMeasurementsCard />

            <View className='flex flex-col gap-1'>
              <View className='flex flex-row items-center gap-2'>
                {SvgIcon.graph({ size: ICON_SIZE.EXTRA_SMALL, color: 'PRIMARY' })}
                <Text className='text-xl font-inter-semibold'>Insights</Text>
              </View>

              <Text className='text-muted-foreground text-xs'>
                Get detailed insights into your measurements over time.
              </Text>
            </View>

            <Tabs
              value={tabValue}
              onValueChange={setTabValue}
              className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
            >
              <TabsList className='flex-row w-full'>
                <TabsTrigger value='chart1' className='flex-1'>
                  <Text>Weight</Text>
                </TabsTrigger>
                <TabsTrigger value='chart2' className='flex-1'>
                  <Text>Waist & Hip</Text>
                </TabsTrigger>
              </TabsList>
              <TabsContent value='chart1'>
                <WeightOverTimeChart />
              </TabsContent>
              <TabsContent value='chart2'>
                <WaistHipOverTimeChart />
              </TabsContent>
            </Tabs>
          </View>
        }
        renderItem={({ item }) => <MeasurementCard />}
        contentContainerClassName='gap-4 p-4'
      />
    </SafeAreaView>
  )
}
