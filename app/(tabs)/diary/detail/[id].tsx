import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CurrentMeasurementsCard from '~/components/card/current-measurements-card'
import MeasurementCard from '~/components/card/measurement-card'
import Loading from '~/components/loading'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import { getCurrentWeekRange } from '~/features/diary/chart/chart-utils'
import WaistHipOverTimeChart from '~/features/diary/chart/waist-hip-over-time-chart'
import WeightOverTimeChart from '~/features/diary/chart/weight-over-time-chart'
import { useGetDiaryDetail } from '~/features/diary/get-diary-detail/use-get-diary-detail'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { DiaryDetail, Measurement } from '~/types/diary.type'

// Constants
const CHART_TABS = {
  WEIGHT: 'chart1',
  WAIST_HIP: 'chart2'
} as const

// Props
interface DiaryHeaderProps {
  diaryName: string | undefined
  diaryId: string
  onGoBack: () => void
}

interface CurrentWeekSectionProps {
  measurement: Measurement | undefined
}

interface InsightsSectionProps {
  currentWeekData: DiaryDetail | null | undefined
  diaryId: string
}

// Components
const DiaryHeader = ({ diaryName, diaryId, onGoBack }: DiaryHeaderProps) => {
  const router = useRouter()

  const handleSettingsPress = () => {
    router.push(`/diary/detail/${diaryId}/setting`)
  }

  return (
    <>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={onGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='text-xl font-inter-semibold flex-1'>{diaryName}&apos;s Diary</Text>
        <TouchableOpacity onPress={handleSettingsPress}>
          <Feather name='settings' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>
      <Separator />
    </>
  )
}

const CurrentWeekSection = ({ measurement }: CurrentWeekSectionProps) => (
  <View className='flex flex-col gap-4'>
    <View className='flex flex-col gap-1'>
      <View className='flex flex-row items-center gap-2'>
        {SvgIcon.calendar({ size: ICON_SIZE.EXTRA_SMALL, color: 'PRIMARY' })}
        <Text className='font-inter-semibold'>Current Week - {measurement?.weekOfPregnancy}</Text>
      </View>
      <Text className='text-muted-foreground text-xs'>
        You can edit measurements only in the current week. Previous weeks&apos; data cannot be changed.
      </Text>
    </View>

    <CurrentMeasurementsCard measurement={measurement} />
  </View>
)

const InsightsSection = ({ currentWeekData, diaryId }: InsightsSectionProps) => {
  const [tabValue, setTabValue] = useState<string>(CHART_TABS.WEIGHT)

  return (
    <View className='flex flex-col gap-4'>
      <View className='flex flex-col gap-1'>
        <View className='flex flex-row items-center gap-2'>
          {SvgIcon.graph({ size: ICON_SIZE.EXTRA_SMALL, color: 'PRIMARY' })}
          <Text className='font-inter-semibold'>Insights</Text>
        </View>
        <Text className='text-muted-foreground text-xs'>Get detailed insights into your measurements over time.</Text>
      </View>

      <Card className='p-2 min-h-96'>
        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          className='w-full max-w-[400px] mx-auto flex-col gap-1.5 flex-1'
        >
          <TabsList className='flex-row w-full'>
            <TabsTrigger value={CHART_TABS.WEIGHT} className='flex-1'>
              <Text>Weight</Text>
            </TabsTrigger>
            <TabsTrigger value={CHART_TABS.WAIST_HIP} className='flex-1'>
              <Text>Waist & Hip</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={CHART_TABS.WEIGHT} className='flex-1'>
            <WeightOverTimeChart
              currentWeek={currentWeekData?.measurements[0]?.weekOfPregnancy || 0}
              currentWeight={currentWeekData?.measurements[0]?.weight || 0}
              diaryId={diaryId}
            />
          </TabsContent>

          <TabsContent value={CHART_TABS.WAIST_HIP} className='flex-1'>
            <WaistHipOverTimeChart
              currentWeek={currentWeekData?.measurements[0]?.weekOfPregnancy || 0}
              currentWaist={currentWeekData?.measurements[0]?.waist || 0}
              currentHip={currentWeekData?.measurements[0]?.hip || 0}
              diaryId={diaryId}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </View>
  )
}

// Screen
export default function MeasurementDiaryDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }

  const currentWeekRange = getCurrentWeekRange()

  const { data: currentWeekData, isLoading: isCurrentWeekLoading } = useGetDiaryDetail({
    diaryId: id,
    ...currentWeekRange
  })

  const handleGoBack = () => {
    router.back()
  }

  const renderMeasurementItem = () => <MeasurementCard />

  const renderListHeader = () => (
    <View className='flex flex-col gap-4'>
      <CurrentWeekSection
        measurement={
          currentWeekData?.measurements.length && currentWeekData?.measurements.length >= 1
            ? currentWeekData?.measurements[0]
            : undefined
        }
      />

      <InsightsSection currentWeekData={currentWeekData} diaryId={id} />
    </View>
  )

  if (isCurrentWeekLoading) {
    return <Loading />
  }

  return (
    <SafeAreaView className='flex-1'>
      <DiaryHeader diaryName={currentWeekData?.name} diaryId={id} onGoBack={handleGoBack} />

      <FlatList
        data={[]}
        ListHeaderComponent={renderListHeader}
        renderItem={renderMeasurementItem}
        contentContainerClassName='gap-4 p-4'
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}
