import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import FeedbackItem from '~/features/dress/components/feedback-item'
import { useGetFeedbacks } from '~/features/dress/hooks/use-get-feedbacks'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function ViewDressFeedbackScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: feedbacks, isLoading: isLoadingFeedbacks, refetch: refetchFeedbacks } = useGetFeedbacks(id)

  const { refreshControl } = useRefreshs([refetchFeedbacks])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace({
        pathname: '/product/[id]',
        params: {
          id
        }
      })
    }
  }

  if (isLoadingFeedbacks) {
    return <Loading />
  }

  return (
    <SafeView>
      <View className='flex flex-row justify-between items-center p-4'>
        <View className='flex-row items-center gap-3 flex-1'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-medium text-xl'>Đánh giá</Text>
        </View>
        <View className='flex flex-row items-center gap-6 mr-1.5'>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Feather name='shopping-bag' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/chat')}>
            <Feather name='message-circle' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
        </View>
      </View>

      <View className='bg-muted h-2' />

      <View className='flex-1'>
        <FlatList
          data={feedbacks?.feedbacks}
          renderItem={({ item, index }) => (
            <>
              <View className='px-4 py-2 gap-2'>
                <FeedbackItem feedback={item} isExpandDescription={true} />
                <Text className='text-muted-foreground text-[9px]'>
                  {item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy') : ''}
                </Text>
              </View>
              {index !== (feedbacks?.feedbacks?.length ?? 0) - 1 && <Separator />}
            </>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text className='text-center text-muted-foreground'>Không có đánh giá</Text>}
          refreshControl={refreshControl}
        />
      </View>
    </SafeView>
  )
}
