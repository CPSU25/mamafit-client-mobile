import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Card } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import CurrentMeasurementsCard from '~/features/diary/components/cards/current-measurements-card'
import WaistHipOverTimeChart from '~/features/diary/components/charts/waist-hip-over-time-chart'
import WeightOverTimeChart from '~/features/diary/components/charts/weight-over-time-chart'
import { useGetWeekOfPregnancy } from '~/features/diary/hooks/use-get-week-of-pregnancy'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Measurement } from '~/types/diary.type'

// Constants
const CHART_TABS = {
  WEIGHT: 'chart1',
  WAIST_HIP: 'chart2'
} as const

// Props
interface DiaryHeaderProps {
  diaryId: string
  onGoBack: () => void
}

interface CurrentWeekSectionProps {
  measurement: Measurement | null | undefined
  diaryId: string
}

interface InsightsSectionProps {
  currentWeekData: Measurement | null | undefined
  diaryId: string
  weightRefetchRef: React.MutableRefObject<(() => Promise<any>) | null>
  waistHipRefetchRef: React.MutableRefObject<(() => Promise<any>) | null>
}

// Components
const DiaryHeader = ({ diaryId, onGoBack }: DiaryHeaderProps) => {
  const router = useRouter()

  return (
    <>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={onGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='text-xl font-inter-semibold flex-1'>Chi Tiết Nhật Ký</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: '/diary/[id]/history', params: { id: diaryId } })}>
          <Feather name='clock' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({ pathname: '/diary/[id]/setting', params: { id: diaryId } })}>
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
        <Text className='font-inter-semibold'>Tuần Hiện Tại - {measurement?.weekOfPregnancy}</Text>
      </View>
      <Text className='text-muted-foreground text-xs'>
        Bạn chỉ có thể chỉnh sửa số đo trong tuần hiện tại. Dữ liệu của các tuần trước không thể chỉnh sửa.
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
      {/* <View className='flex flex-col gap-1'>
        <View className='flex flex-row items-center gap-2'>
          {SvgIcon.graph({ size: ICON_SIZE.EXTRA_SMALL, color: 'PRIMARY' })}
          <Text className='font-inter-semibold'>Insights</Text>
        </View>
        <Text className='text-muted-foreground text-xs'>Get detailed insights into your measurements over time.</Text>
      </View> */}

      <Card className='p-2 min-h-96'>
        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          className='w-full max-w-[400px] mx-auto flex-col gap-1.5 flex-1'
        >
          <TabsList className='flex-row w-full'>
            <TabsTrigger value={CHART_TABS.WEIGHT} className='flex-1'>
              <Text>Cân Nặng</Text>
            </TabsTrigger>
            <TabsTrigger value={CHART_TABS.WAIST_HIP} className='flex-1'>
              <Text>Eo & Mông</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={CHART_TABS.WEIGHT} className='flex-1'>
            <WeightOverTimeChart
              currentWeekData={currentWeekData}
              diaryId={diaryId}
              onRefetchReady={handleWeightRefetchReady}
            />
          </TabsContent>

          <TabsContent value={CHART_TABS.WAIST_HIP} className='flex-1'>
            <WaistHipOverTimeChart
              currentWeekData={currentWeekData}
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

  const {
    data: currentWeekData,
    isLoading: isCurrentWeekLoading,
    refetch: refetchCurrentWeek
  } = useGetWeekOfPregnancy(id)

  const weightRefetchRef = useRef<(() => Promise<any>) | null>(null)
  const waistHipRefetchRef = useRef<(() => Promise<any>) | null>(null)

  const getAllRefetches = useCallback(() => {
    const refetches = [refetchCurrentWeek]
    if (weightRefetchRef.current) refetches.push(weightRefetchRef.current)
    if (waistHipRefetchRef.current) refetches.push(waistHipRefetchRef.current)
    return refetches
  }, [refetchCurrentWeek])

  const { refreshControl } = useRefreshs(getAllRefetches())

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/diary')
    }
  }

  if (isCurrentWeekLoading) {
    return <Loading />
  }

  return (
    <SafeView>
      <DiaryHeader diaryId={id} onGoBack={handleGoBack} />
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1' refreshControl={refreshControl}>
        <View className='flex flex-col gap-4 p-4'>
          <CurrentWeekSection measurement={currentWeekData} diaryId={id} />
          <InsightsSection
            currentWeekData={currentWeekData}
            diaryId={id}
            weightRefetchRef={weightRefetchRef}
            waistHipRefetchRef={waistHipRefetchRef}
          />
        </View>
      </ScrollView>
    </SafeView>
  )
}
