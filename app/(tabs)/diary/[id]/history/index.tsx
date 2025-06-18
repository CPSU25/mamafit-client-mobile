import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MeasurementCard from '~/components/card/measurement-card'
import { Text } from '~/components/ui/text'
import { useGetDiaryDetail } from '~/features/diary/get-diary-detail/use-get-diary-detail'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function DiaryHistoryScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }
  const { data: measurementsHistory } = useGetDiaryDetail({ diaryId: id })

  const handleGoBack = () => {
    router.back()
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='text-xl font-inter-semibold flex-1'>History</Text>
        <TouchableOpacity>
          <Feather name='plus' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>

      <View className='bg-muted h-2' />

      <FlatList
        data={measurementsHistory?.measurements.sort((a, b) => b.weekOfPregnancy - a.weekOfPregnancy)}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/diary/${id}/history/${item.id}`)}>
            <MeasurementCard measurement={item} />
          </Pressable>
        )}
        contentContainerClassName='p-4 gap-4'
      />
    </SafeAreaView>
  )
}
