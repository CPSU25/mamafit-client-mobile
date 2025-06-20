import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '~/components/loading'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useGetDiaries } from '~/features/diary/hooks/use-get-diaries'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import DiaryCard from '../cards/diary-card'

export default function DiariesList({ nameSearch }: { nameSearch: string }) {
  const router = useRouter()

  const {
    data: diaries,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetDiaries(nameSearch)
  const { refreshControl } = useRefreshs([refetch])

  return (
    <FlatList
      data={diaries?.pages.flatMap((page) => page.items)}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.duration(200).delay(index * 50)}>
          <Pressable
            className=''
            onPress={() =>
              router.push({
                pathname: '/diary/[id]/detail',
                params: { id: item.id }
              })
            }
          >
            <DiaryCard diary={item} />
          </Pressable>
        </Animated.View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerClassName='gap-4 p-4 pb-40'
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
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator size='large' color={PRIMARY_COLOR.LIGHT} className='mt-2' /> : null
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.2}
      contentInsetAdjustmentBehavior='automatic'
      refreshControl={refreshControl}
    />
  )
}
