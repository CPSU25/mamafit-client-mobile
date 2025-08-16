import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import HistoriesList from '~/features/diary/components/lists/histories-list'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function DiaryHistoryScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/diary')
    }
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-3 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='text-xl font-inter-semibold flex-1'>Lịch Sử</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: '/diary/[id]/create', params: { id } })}>
          <Feather name='plus' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>

      <View className='bg-muted h-2' />

      <HistoriesList />
    </SafeView>
  )
}
