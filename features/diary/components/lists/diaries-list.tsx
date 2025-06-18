import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FlatList, Pressable, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '~/components/loading'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { useGetDiaries } from '~/features/diary/hooks'
import { DiaryCard } from '../cards'

export default function DiariesList() {
  const router = useRouter()

  const { data: diaries, refetch, isLoading } = useGetDiaries()

  const { refreshControl, refreshing } = useRefreshs([refetch], {
    title: 'Pull to refresh diaries'
  })

  return (
    <FlatList
      data={diaries?.items}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.duration(200).delay(index * 100)}>
          <Pressable onPress={() => router.push(`/diary/${item.id}/detail`)}>
            <DiaryCard diary={item} />
          </Pressable>
        </Animated.View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerClassName='gap-4 p-4 pb-60'
      ListEmptyComponent={
        isLoading ? (
          <Loading />
        ) : (
          <View className='flex items-center px-4 mt-48'>
            {SvgIcon.diary({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
            <Text className='text-muted-foreground text-sm mt-2'>Create your first diary to get started!</Text>
            <Button
              size='sm'
              className='mt-8 flex flex-row items-center gap-2'
              onPress={() => router.push('/diary/create')}
            >
              <Feather name='plus' size={16} color='white' />
              <Text className='font-inter-medium'>Create Diary</Text>
            </Button>
          </View>
        )
      }
      contentInsetAdjustmentBehavior='automatic'
      refreshControl={refreshControl}
      refreshing={refreshing}
    />
  )
}
