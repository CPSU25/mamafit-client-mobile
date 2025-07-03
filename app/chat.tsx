import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import * as React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import ChatRoom from '~/features/chat/components/chat-room'
import { useGetRooms } from '~/features/chat/hooks/use-get-rooms'
import { useAuth } from '~/hooks/use-auth'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function ChatScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { data: rooms, isLoading: isRoomsLoading, refetch } = useGetRooms()
  const { refreshControl } = useRefreshs([refetch])

  if (isLoading || isRoomsLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  const handleGoBack = () => {
    router.back()
  }

  const chats = [1, 2, 3, 4, 5]

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1'>
        <View className='flex flex-row items-center gap-4 p-4'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-semibold text-xl'>Chats</Text>
        </View>

        <View className='bg-muted h-2' />

        <FlatList
          data={rooms}
          renderItem={({ item, index }) => (
            <>
              <ChatRoom room={item} />
              {index !== chats.length - 1 && <Separator className='mt-4' />}
            </>
          )}
          contentContainerClassName='gap-4 p-4'
          refreshControl={refreshControl}
        />
      </View>
    </SafeAreaView>
  )
}
