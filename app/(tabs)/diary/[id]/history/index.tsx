import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import { HistoriesList } from '~/features/diary/components/lists'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function DiaryHistoryScreen() {
  const router = useRouter()

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

      <HistoriesList />
    </SafeAreaView>
  )
}
