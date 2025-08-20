import { useRouter } from 'expo-router'
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import type { ComponentType } from 'react'
import { Text } from '~/components/ui/text'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { useGetDresses } from '../hooks/use-get-dresses'
import DressCard from './dress-card'

interface DressesListProps {
  search?: string
  styleId?: string
  headerComponent?: ComponentType<any> | null
}

export default function DressesList({ search, styleId, headerComponent }: DressesListProps) {
  const router = useRouter()

  const {
    data: dresses,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useGetDresses(search, styleId)

  const { refreshControl } = useRefreshs([refetch])

  return (
    <FlatList
      data={dresses?.pages.flatMap((page) => page.items)}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(index * 50)} className='flex-1' style={{ maxWidth: '48%' }}>
          <TouchableOpacity
            className='flex-1'
            onPress={() =>
              router.push({
                pathname: '/product/[id]',
                params: { id: item.id }
              })
            }
          >
            <DressCard dress={item} />
          </TouchableOpacity>
        </Animated.View>
      )}
      showsVerticalScrollIndicator={false}
      columnWrapperClassName='px-4 gap-2'
      contentContainerClassName='pb-20 gap-2'
      className='bg-muted'
      ListHeaderComponent={headerComponent ?? null}
      ListFooterComponent={
        isFetchingNextPage || isLoading ? (
          <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} className='mt-2' />
        ) : (
          <View className='my-4'>
            <Text className='text-center text-muted-foreground text-sm'>Không có sản phẩm</Text>
          </View>
        )
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.2}
      numColumns={2}
      contentInsetAdjustmentBehavior='automatic'
      refreshControl={refreshControl}
    />
  )
}
