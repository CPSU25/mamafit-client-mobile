import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CurrentMeasurementsCard from '~/components/card/current-measurements-card'
import Loading from '~/components/loading'
import { Card } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import { getCurrentWeekRange } from '~/features/diary/components/chart/chart-utils'
import WaistHipOverTimeChart from '~/features/diary/components/chart/waist-hip-over-time-chart'
import WeightOverTimeChart from '~/features/diary/components/chart/weight-over-time-chart'
import { useGetDiaryDetail } from '~/features/diary/hooks/use-get-diary-detail'
import { useRefreshs } from '~/hooks/use-refresh'
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
  diaryId: string
}

interface InsightsSectionProps {
  currentWeekData: DiaryDetail | null | undefined
  diaryId: string
  weightRefetchRef: React.MutableRefObject<(() => Promise<any>) | null>
  waistHipRefetchRef: React.MutableRefObject<(() => Promise<any>) | null>
}

// Components
const DiaryHeader = ({ diaryName, diaryId, onGoBack }: DiaryHeaderProps) => {
  const router = useRouter()

  return (
    <>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={onGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='text-xl font-inter-semibold flex-1'>{diaryName}&apos;s Diary</Text>
        <TouchableOpacity onPress={() => router.push(`/diary/${diaryId}/history`)}>
          <Feather name='clock' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(`/diary/${diaryId}/setting`)}>
          <Feather name='settings' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>
      <View className='bg-muted h-2' />
    </>
  )
}

const CurrentWeekSection = ({ measurement, diaryId }: CurrentWeekSectionProps) => (
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

    <CurrentMeasurementsCard measurement={measurement} diaryId={diaryId} />
  </View>
)

const InsightsSection = ({ currentWeekData, diaryId, weightRefetchRef, waistHipRefetchRef }: InsightsSectionProps) => {
  const [tabValue, setTabValue] = useState<string>(CHART_TABS.WEIGHT)

  const handleWeightRefetchReady = useCallback(
    (refetch: () => Promise<any>) => {
      weightRefetchRef.current = refetch
    },
    [weightRefetchRef]
  )

  const handleWaistHipRefetchReady = useCallback(
    (refetch: () => Promise<any>) => {
      waistHipRefetchRef.current = refetch
    },
    [waistHipRefetchRef]
  )

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
              onRefetchReady={handleWeightRefetchReady}
            />
          </TabsContent>

          <TabsContent value={CHART_TABS.WAIST_HIP} className='flex-1'>
            <WaistHipOverTimeChart
              currentWeek={currentWeekData?.measurements[0]?.weekOfPregnancy || 0}
              currentWaist={currentWeekData?.measurements[0]?.waist || 0}
              currentHip={currentWeekData?.measurements[0]?.hip || 0}
              diaryId={diaryId}
              onRefetchReady={handleWaistHipRefetchReady}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </View>
  )
}

// Screen
export default function DiaryDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }

  const currentWeekRange = getCurrentWeekRange()

  const {
    data: currentWeekData,
    isLoading: isCurrentWeekLoading,
    refetch: refetchCurrentWeek
  } = useGetDiaryDetail({
    diaryId: id,
    ...currentWeekRange
  })

  const weightRefetchRef = useRef<(() => Promise<any>) | null>(null)
  const waistHipRefetchRef = useRef<(() => Promise<any>) | null>(null)

  const getAllRefetches = useCallback(() => {
    const refetches = [refetchCurrentWeek]
    if (weightRefetchRef.current) refetches.push(weightRefetchRef.current)
    if (waistHipRefetchRef.current) refetches.push(waistHipRefetchRef.current)
    return refetches
  }, [refetchCurrentWeek])

  const { refreshControl } = useRefreshs(getAllRefetches(), {
    title: 'Pull to refresh diary data'
  })

  const handleGoBack = () => {
    router.back()
  }

  if (isCurrentWeekLoading) {
    return <Loading />
  }

  return (
    <SafeAreaView className='flex-1'>
      <DiaryHeader diaryName={currentWeekData?.name} diaryId={id} onGoBack={handleGoBack} />
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1' refreshControl={refreshControl}>
        <View className='flex flex-col gap-4 p-4'>
          <CurrentWeekSection
            measurement={
              currentWeekData?.measurements.length && currentWeekData?.measurements.length >= 1
                ? currentWeekData?.measurements[0]
                : undefined
            }
            diaryId={id}
          />
          <InsightsSection
            currentWeekData={currentWeekData}
            diaryId={id}
            weightRefetchRef={weightRefetchRef}
            waistHipRefetchRef={waistHipRefetchRef}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
