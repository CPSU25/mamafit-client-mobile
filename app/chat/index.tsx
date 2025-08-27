import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import * as React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Icon } from '~/components/ui/icon'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import ChatRoom from '~/features/chat/components/chat-room'
import { useGetRooms } from '~/features/chat/hooks/use-get-rooms'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function ChatScreen() {
  const router = useRouter()

  const { data: rooms, refetch, isLoading } = useGetRooms()
  const { refreshControl } = useRefreshs([refetch])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  // TODO: add badge number for new messages

  return (
    <SafeView>
      <View className='flex-1'>
        <View className='flex flex-row items-center gap-3 p-4'>
          <TouchableOpacity onPress={handleGoBack}>
            <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-medium text-xl'>Trò chuyện</Text>
        </View>

        <View className='bg-muted h-2' />

        <FlatList
          data={rooms}
          ListEmptyComponent={
            isLoading ? (
              <Loading />
            ) : (
              <View className='flex items-center px-4 mt-10'>
                <Text className='text-muted-foreground text-sm mt-2'>Không tìm thấy trò chuyện</Text>
              </View>
            )
          }
          renderItem={({ item, index }) => (
            <>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/chat/[roomId]',
                    params: { roomId: item.id }
                  })
                }
              >
                <ChatRoom room={item} />
              </TouchableOpacity>
              {index !== (rooms?.length ?? 0) - 1 && <Separator className='mt-4' />}
            </>
          )}
          contentContainerClassName='gap-4 p-4'
          refreshControl={refreshControl}
        />
      </View>
    </SafeView>
  )
}
