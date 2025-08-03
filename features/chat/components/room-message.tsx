import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { Message, MessageTypeDB } from '~/types/chat.type'
import { useGetDesignRequest } from '../hooks/use-get-design-request'

interface RoomMessageProps {
  message: Message<MessageTypeDB>
}

interface DesignRequestMessage {
  messageContent: string
  designRequestId: string
  orderId: string
}

const formatDesignRequestMessage = (message: string, type: MessageTypeDB): DesignRequestMessage => {
  try {
    const msg = JSON.parse(message) as DesignRequestMessage
    return msg
  } catch {
    return {
      messageContent: '',
      designRequestId: '',
      orderId: ''
    }
  }
}

export default function RoomMessage({ message }: RoomMessageProps) {
  const { user } = useAuth()
  const router = useRouter()

  const isMe = message.senderId === user?.userId

  const parsedDesignRequest =
    message.type === MessageTypeDB.DesignRequest ? formatDesignRequestMessage(message.message, message.type) : null

  const { data: designRequest, isLoading: isLoadingDesignRequest } = useGetDesignRequest(
    parsedDesignRequest ? parsedDesignRequest.designRequestId : ''
  )

  if (message.type === MessageTypeDB.Text) {
    return (
      <View className={cn('flex-row', isMe ? 'justify-end' : 'justify-start')}>
        <View className={cn('max-w-[80%] rounded-2xl py-2 px-4', isMe ? 'bg-primary' : 'bg-muted')}>
          <Text className={cn('text-base', isMe ? 'text-white' : 'text-foreground')}>{message.message}</Text>
          <Text className={cn('text-xs mt-1', isMe ? 'text-white/50 text-right' : 'text-foreground/50 text-left')}>
            {format(message.messageTimestamp, 'hh:mm a')}
          </Text>
        </View>
      </View>
    )
  }

  if (message.type === MessageTypeDB.Image) {
    return (
      <View className={cn('flex-row', isMe ? 'justify-end' : 'justify-start')}>
        <View className='max-w-[80%]'>
          <Image source={{ uri: message.message }} className='w-40 h-40 rounded-2xl' />
          <Text
            className={cn('text-xs mt-1', isMe ? 'text-muted-foreground text-right' : 'text-foreground/50 text-left')}
          >
            {format(message.messageTimestamp, 'hh:mm a')}
          </Text>
        </View>
      </View>
    )
  }

  if (message.type === MessageTypeDB.DesignRequest && parsedDesignRequest && designRequest) {
    return isLoadingDesignRequest ? (
      <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
    ) : (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => router.push(`/order/${parsedDesignRequest.orderId}`)}
        className='my-2'
        style={{
          shadowColor: '#6366f1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8
        }}
      >
        <LinearGradient
          colors={['#f8f5fc', '#e3d8fc', '#cabffd']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className='rounded-2xl overflow-hidden'
          style={{
            borderWidth: 1,
            borderColor: 'rgba(167, 139, 250, 0.15)',
            boxShadow: '0 0px 10px 0 rgba(124, 58, 237, 0.25)'
          }}
        >
          <View className='flex-row items-center justify-between m-2'>
            <View className='flex-row items-center gap-2'>
              {SvgIcon.penTool({ size: 16, color: 'PRIMARY' })}
              <Text className='text-primary text-sm font-inter-semibold'>Design Request</Text>
            </View>
            <View className='px-2 py-1 bg-white/30 rounded-lg'>
              <Text className='text-primary text-[10px] font-inter-medium'>Tap to view</Text>
            </View>
          </View>

          <View className='mx-2 mb-2'>
            <View className='flex-row gap-3.5'>
              {designRequest?.images?.length > 0 && (
                <View className='relative'>
                  <Image
                    source={{ uri: designRequest.images[0] }}
                    className='w-20 h-20 rounded-xl'
                    resizeMode='cover'
                  />
                  {designRequest.images.length > 1 && (
                    <View className='absolute -top-1.5 -right-1.5 bg-primary rounded-full w-5 h-5 justify-center items-center'>
                      <Text className='text-[8px] text-white font-inter-bold'>+{designRequest.images.length - 1}</Text>
                    </View>
                  )}
                </View>
              )}

              <View className='flex-1 justify-between'>
                <View>
                  <Text className='text-primary/70 text-[8px] font-inter-medium uppercase'>Description</Text>
                  <Text
                    className='text-foreground/80 text-xs font-inter-medium leading-4'
                    numberOfLines={2}
                    ellipsizeMode='tail'
                  >
                    {designRequest?.description}
                  </Text>
                </View>

                {designRequest?.createdAt ? (
                  <View>
                    <Text className='text-primary/70 text-[8px] font-inter-medium uppercase'>Placed</Text>
                    <Text className='text-foreground/80 text-xs font-inter-medium'>
                      {format(designRequest.createdAt, "MMM dd, yyyy 'at' hh:mm a")}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return <Text className='text-center text-xs text-muted-foreground'>Invalid Message</Text>
}
