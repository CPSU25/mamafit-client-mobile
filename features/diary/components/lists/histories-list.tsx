import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, Pressable } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useRefreshs } from '~/hooks/use-refresh'
import { getShadowStyles, styles } from '~/lib/constants/constants'
import { useGetDiaryDetail } from '../../hooks/use-get-diary-detail'
import MeasurementCard from '../cards/measurement-card'

export default function HistoriesList() {
  const router = useRouter()

  const { id } = useLocalSearchParams() as { id: string }
  const { data: measurementsHistory, refetch } = useGetDiaryDetail({ diaryId: id })

  const { refreshControl } = useRefreshs([refetch])

  return (
    <FlatList
      data={measurementsHistory?.measurements.sort((a, b) => b.weekOfPregnancy - a.weekOfPregnancy)}
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/diary/[id]/history/[measurementId]',
              params: { id: id, measurementId: item.id }
            })
          }
        >
          <Animated.View
            className='rounded-2xl'
            entering={FadeInDown.delay(100 * index)}
            style={[styles.container, getShadowStyles()]}
          >
            <MeasurementCard measurement={item} diaryId={id} />
          </Animated.View>
        </Pressable>
      )}
      contentContainerClassName='p-4 gap-4'
      refreshControl={refreshControl}
    />
  )
}
