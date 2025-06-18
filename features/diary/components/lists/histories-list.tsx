import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, Pressable } from 'react-native'
import { useRefreshs } from '~/hooks/use-refresh'
import { useGetDiaryDetail } from '../../hooks/use-get-diary-detail'
import MeasurementCard from '../cards/measurement-card'

export default function HistoriesList() {
  const router = useRouter()

  const { id } = useLocalSearchParams() as { id: string }
  const { data: measurementsHistory, refetch } = useGetDiaryDetail({ diaryId: id })

  const { refreshControl } = useRefreshs([refetch], {
    title: 'Pull to refresh measurements history'
  })

  return (
    <FlatList
      data={measurementsHistory?.measurements.sort((a, b) => b.weekOfPregnancy - a.weekOfPregnancy)}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push(`/diary/${id}/history/${item.id}`)}>
          <MeasurementCard measurement={item} diaryId={id} />
        </Pressable>
      )}
      contentContainerClassName='p-4 gap-4'
      refreshControl={refreshControl}
    />
  )
}
