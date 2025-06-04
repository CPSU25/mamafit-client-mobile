import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DiaryCard from '~/components/card/diary-card'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useGetCurrentUser } from '~/features/auth/current-user/use-get-current-user'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

export default function MeasurementDiaryScreen() {
  const router = useRouter()
  const { data: currentUser } = useGetCurrentUser()

  const diaries = [1, 2, 3, 4, 5]

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-xl font-inter-semibold'>Hello {currentUser?.data?.fullName} 👋</Text>
        <TouchableOpacity>
          <Feather name='plus' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>

      <View className='bg-muted h-2' />
      <View className='flex flex-col gap-4 p-4'>
        {diaries.length > 0 ? (
          <FlatList
            data={diaries}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => router.push('/diary/1')}>
                <DiaryCard />
              </TouchableOpacity>
            )}
            contentContainerClassName='gap-4 pb-32'
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className='flex items-center px-4 mt-48'>
            {SvgIcon.diary({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
            <Text className='text-muted-foreground text-sm mt-2'>Create your first diary to get started!</Text>
            <Button size='sm' className='mt-8 flex flex-row items-center gap-2'>
              <Feather name='plus' size={16} color='white' />
              <Text className='font-inter-medium'>Create Diary</Text>
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
