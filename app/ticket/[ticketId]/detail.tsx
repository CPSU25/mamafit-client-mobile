import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { VideoThumbnail } from '~/components/ui/video-picker'
import { useGetTicket } from '~/features/ticket/hooks/use-get-ticket'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { TicketType } from '~/types/ticket.type'

export default function ViewTicketDetailScreen() {
  const router = useRouter()
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>()

  const { data: ticket, isLoading: isLoadingTicket, refetch: refetchTicket } = useGetTicket(ticketId)

  const { refreshControl } = useRefreshs([refetchTicket])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  if (isLoadingTicket) {
    return <Loading />
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-2 p-4 bg-background'>
        <TouchableOpacity onPress={handleGoBack} className='p-1'>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl text-foreground'>Thông Tin Hỗ Trợ</Text>
      </View>

      <View className='flex-1 bg-muted'>
        <ScrollView refreshControl={refreshControl} showsVerticalScrollIndicator={false} className='flex-1'>
          <View className='p-4 gap-4 flex-1'>
            <Card className='gap-2 p-3 flex-row items-center border-transparent'>
              <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
                <Image
                  source={{ uri: ticket?.order?.items?.[0]?.preset?.images?.[0] }}
                  className='w-full h-full'
                  resizeMode='contain'
                />
              </View>
              <View className='flex-1 h-20 justify-between pr-2'>
                <View>
                  <Text className='native:text-sm font-inter-medium'>
                    {ticket?.order?.items?.[0]?.preset?.styleName || 'Váy Bầu Tùy Chỉnh'}
                  </Text>
                  <View className='flex-row items-center justify-between'>
                    <Text className='native:text-xs text-muted-foreground'>
                      {ticket?.order?.items?.[0]?.preset?.styleName ? 'Váy Bầu Tùy Chỉnh' : 'Váy Bầu Tùy Chỉnh'}
                    </Text>
                    <Text className='native:text-xs text-muted-foreground'>
                      x{ticket?.order?.items?.[0]?.quantity || 1}
                    </Text>
                  </View>
                </View>
                <View className='items-end'>
                  <Text className='native:text-xs'>SKU: {ticket?.order?.items?.[0]?.preset?.sku ?? 'N/A'}</Text>
                </View>
              </View>
            </Card>
            <Card className='px-3 py-2 border-transparent flex-row items-center gap-2'>
              <Text className='font-inter-medium flex-1'>Loại hỗ trợ</Text>
              {ticket?.type === TicketType.DeliveryService ? (
                <Text className='text-xs text-muted-foreground'>Hỗ trợ giao hàng</Text>
              ) : null}
              {ticket?.type === TicketType.WarrantyService ? (
                <Text className='text-xs text-muted-foreground'>Hỗ trợ bảo hành</Text>
              ) : null}
              {ticket?.type === TicketType.Other ? (
                <Text className='text-xs text-muted-foreground'>Hỗ trợ khác</Text>
              ) : null}
            </Card>
            <Card className='px-3 py-2 border-transparent flex-row items-center gap-2'>
              <Text className='font-inter-medium flex-1'>Trạng thái</Text>
              <Text className='text-xs text-muted-foreground'>{ticket?.status ?? 'Đang chờ'}</Text>
            </Card>
            <Card className='gap-1 p-2 border-transparent'>
              <Text className='font-inter-medium'>{ticket?.title}</Text>
              <Text className='text-sm text-muted-foreground/80'>{ticket?.description}</Text>
            </Card>
            <Card className='gap-1 p-2 border-transparent'>
              <Text className='font-inter-medium mb-1'>Hình ảnh & Video</Text>
              <ScrollView nestedScrollEnabled horizontal showsHorizontalScrollIndicator={false}>
                <View className='flex-row items-center gap-3'>
                  {(ticket?.videos ?? []).map((img, index) => (
                    <VideoThumbnail key={index + '-' + img} uri={img} className='w-28 h-28 rounded-xl' />
                  ))}
                  {(ticket?.images ?? []).map((img, index) => (
                    <Image key={index + '-' + img} source={{ uri: img }} className='w-28 h-28 rounded-xl' />
                  ))}
                </View>
              </ScrollView>
            </Card>
          </View>
        </ScrollView>
      </View>
    </SafeView>
  )
}
