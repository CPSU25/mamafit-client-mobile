import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { FlatList, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useGetTickets } from '~/features/ticket/hooks/use-get-tickets'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { TicketType } from '~/types/ticket.type'

export default function ViewTicketHistoryScreen() {
  const router = useRouter()
  const { data: tickets, isLoading: isLoadingTickets, refetch: refetchTickets } = useGetTickets()

  const { refreshControl } = useRefreshs([refetchTickets])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  if (isLoadingTickets) {
    return <Loading />
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-2 p-4 bg-background'>
        <TouchableOpacity onPress={handleGoBack} className='p-1'>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl text-foreground'>Lịch sử hỗ trợ</Text>
      </View>

      <View className='bg-muted h-2' />

      <FlatList
        data={tickets}
        refreshControl={refreshControl}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/ticket/[ticketId]/detail', params: { ticketId: item.id } })}
          >
            <Card style={styles.container}>
              <View className='px-3 py-2 flex-row items-center'>
                <View className='flex-1'>
                  {item.type === TicketType.DeliveryService ? (
                    <View className='flex-row items-center gap-2'>
                      <View className='w-2 h-2 rounded-full bg-blue-500' />
                      <Text className='text-xs font-inter-medium'>Hỗ trợ giao hàng</Text>
                    </View>
                  ) : null}
                  {item.type === TicketType.WarrantyService ? (
                    <View className='flex-row items-center gap-2'>
                      <View className='w-2 h-2 rounded-full bg-emerald-500' />
                      <Text className='text-xs font-inter-medium'>Hỗ trợ bảo hành</Text>
                    </View>
                  ) : null}
                  {item.type === TicketType.Other ? (
                    <View className='flex-row items-center gap-2'>
                      <View className='w-2 h-2 rounded-full bg-amber-500' />
                      <Text className='text-xs font-inter-medium'>Hỗ trợ khác</Text>
                    </View>
                  ) : null}
                </View>
                <Text className='text-[9px] text-muted-foreground'>
                  {format(new Date(item.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                </Text>
              </View>

              <Separator />

              <View className='flex-row items-center gap-4 px-3 py-2'>
                <View className='flex-1 gap-1'>
                  <Text className='text-sm font-inter-medium' numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className='text-xs text-muted-foreground' numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <View className='flex-row items-center gap-4'>
                  <View className='items-center gap-1'>
                    <Feather name='video' size={18} color={PRIMARY_COLOR.LIGHT} />
                    <Text className='text-[8px] text-muted-foreground font-inter-medium'>
                      {item.videos.length} Video
                    </Text>
                  </View>
                  <View className='items-center gap-1'>
                    <Feather name='image' size={18} color={PRIMARY_COLOR.LIGHT} />
                    <Text className='text-[8px] text-muted-foreground font-inter-medium'>{item.images.length} Ảnh</Text>
                  </View>
                </View>
              </View>

              <Separator />

              <View className='flex-row items-center gap-2 px-3 py-2'>
                <Text className='text-xs text-muted-foreground flex-1'>Trạng thái</Text>
                <Text className='text-xs text-muted-foreground'>{item.status ?? 'Đang chờ'}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerClassName='gap-4 p-4'
        ListEmptyComponent={
          <View className='flex-1 items-center justify-center p-8'>
            <Text className='text-center text-muted-foreground'>Không tìm thấy lịch sử hỗ trợ</Text>
          </View>
        }
      />
    </SafeView>
  )
}
