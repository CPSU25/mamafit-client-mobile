import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import SafeView from '~/components/safe-view'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import RoomMessage from '~/features/chat/components/room-message'
import { useChat } from '~/features/chat/hooks/use-chat'
import { useGetRoom } from '~/features/chat/hooks/use-get-room'
import { useGetRoomMessages } from '~/features/chat/hooks/use-get-room-messages'
import { useAuth } from '~/hooks/use-auth'
import { useImagePicker } from '~/hooks/use-image-picker'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, placeholderImage, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { isValidUrl } from '~/lib/utils'
import { MessageTypeRealTime } from '~/types/chat.type'

export default function ChatRoomScreen() {
  const router = useRouter()
  const { roomId } = useLocalSearchParams() as { roomId: string }
  const { user } = useAuth()
  const { sendMessage } = useChat()
  const [message, setMessage] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetRoomMessages(roomId)

  const messages = messagesData?.pages?.flat() || []

  const { data: room, isLoading: isLoadingRoom, refetch: refetchRoom } = useGetRoom(roomId)

  const { refreshControl } = useRefreshs([refetchMessages, refetchRoom])

  const { pickImages, isUploading } = useImagePicker({ maxImages: 1 })

  const sender = room?.members?.find((member) => member.memberId !== user?.userId) ?? room?.members?.[0]
  const imageSource = sender?.memberAvatar && isValidUrl(sender?.memberAvatar) ? sender?.memberAvatar : placeholderImage

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
      }, 100)
    }
  }, [messages.length])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      setIsSendingMessage(true)
      await sendMessage(roomId, message.trim(), MessageTypeRealTime.Text)
      setMessage('')

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
      }, 100)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleSendImage = async () => {
    const urls = await pickImages()
    if (urls.length > 0) {
      await sendMessage(roomId, urls[0], MessageTypeRealTime.Image)

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
      }, 100)
    }
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/chat')
    }
  }

  // TODO: add online status
  return (
    <SafeView>
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={5} className='flex-1'>
        <View className='flex-1'>
          <View className='flex-row items-center gap-4 p-4'>
            <TouchableOpacity onPress={handleGoBack}>
              <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>

            {isLoadingRoom ? (
              <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
            ) : (
              <>
                <Avatar alt={sender?.memberName ?? ''} className='size-10'>
                  <AvatarImage source={{ uri: imageSource }} />
                  <AvatarFallback>
                    <Text>{sender?.memberName?.charAt(0) ?? '?'}</Text>
                  </AvatarFallback>
                </Avatar>
                <View className='flex-1'>
                  <Text className='text-sm font-inter-medium'>{sender?.memberName ?? 'Unknown User'}</Text>
                  <View className='flex-row items-center gap-2'>
                    <View className='size-2 bg-emerald-500 rounded-full' />
                    <Text className='text-xs text-muted-foreground'>Online</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {isLoadingMessages ? (
            <View className='flex-1 items-center justify-center'>
              <ActivityIndicator size='large' color={PRIMARY_COLOR.LIGHT} />
              <Text className='mt-2 text-sm text-muted-foreground'>Loading messages...</Text>
            </View>
          ) : !messages || messages.length === 0 ? (
            <View className='flex-1 items-center justify-center p-4'>
              <Text className='text-center text-muted-foreground mb-1'>No messages yet</Text>
              <Text className='text-center text-muted-foreground text-xs'>
                Start a conversation by sending a message
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              inverted
              data={messages}
              renderItem={({ item }) => <RoomMessage message={item} />}
              refreshControl={refreshControl}
              contentContainerClassName='gap-2 p-4'
              contentContainerStyle={{ flexDirection: 'column-reverse' }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `${item.id}-${item.messageTimestamp}-${index}`}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage()
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View className='py-4 items-center'>
                    <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
                    <Text className='mt-2 text-muted-foreground text-sm'>Loading more messages...</Text>
                  </View>
                ) : null
              }
            />
          )}

          <View className='flex-row items-center gap-4 px-4 pt-2 pb-1'>
            <Input
              StartIcon={
                isUploading ? (
                  <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
                ) : (
                  <Feather name='image' size={20} color={PRIMARY_COLOR.LIGHT} />
                )
              }
              onStartIconPress={handleSendImage}
              placeholder={isSendingMessage ? 'Sending...' : 'Type your message...'}
              className='shrink'
              value={message}
              onChangeText={setMessage}
              editable={!isSendingMessage && !isLoadingRoom}
              maxLength={1000}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={isLoadingMessages || !message.trim() || isSendingMessage || isLoadingRoom}
              className={`${isLoadingMessages || !message.trim() || isSendingMessage || isLoadingRoom ? 'opacity-50' : ''}`}
            >
              {isSendingMessage ? (
                <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
              ) : (
                SvgIcon.sendTo({ size: ICON_SIZE.SMALL })
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeView>
  )
}
