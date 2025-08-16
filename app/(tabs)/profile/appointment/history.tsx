import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import AppointmentCard from '~/components/card/appointment-card'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import { useGetAppointments } from '~/features/appointment/hooks/use-get-appointments'
import { DateRange, SectionData } from '~/features/appointment/types'
import { createDateRangeKey, formatDateStr, parseDateRangeKey } from '~/features/appointment/utils'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { Appointment } from '~/types/appointment.type'

const SectionHeader = ({ dateRange }: { dateRange: DateRange }) => {
  const isRangeDisplay = dateRange.from.getTime() !== dateRange.to.getTime()

  return (
    <View className='px-4 pt-4 pb-2 bg-background'>
      <Text className='text-lg font-inter-semibold text-foreground'>{dateRange.date}</Text>
      {isRangeDisplay ? (
        <Text className='text-sm font-inter-regular text-muted-foreground'>
          {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
        </Text>
      ) : null}
    </View>
  )
}

export default function AppointmentHistoryScreen() {
  const router = useRouter()
  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    refetch: refetchAppointments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetAppointments()
  const { refreshControl } = useRefreshs([refetchAppointments])

  // Group appointments by date range with better performance
  const groupedAppointments = useMemo(() => {
    if (!appointments?.pages) return new Map<string, Appointment[]>()

    const flattenedAppointments = appointments.pages.flatMap((page) => page.items)
    const grouped = new Map<string, Appointment[]>()

    flattenedAppointments.forEach((appointment) => {
      const dateRange = formatDateStr(appointment.bookingTime)
      const key = createDateRangeKey(dateRange)

      const existingGroup = grouped.get(key) ?? []
      grouped.set(key, [...existingGroup, appointment])
    })

    return grouped
  }, [appointments?.pages])

  const sectionsData = useMemo(() => {
    const sections: SectionData[] = []
    Array.from(groupedAppointments.keys()).forEach((key) => {
      const appointmentGroup = groupedAppointments.get(key)!
      const dateRange = parseDateRangeKey(key)

      sections.push({ type: 'header', data: dateRange })

      appointmentGroup.forEach((appointment) => {
        sections.push({ type: 'item', data: appointment })
      })
    })

    return sections
  }, [groupedAppointments])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const renderItem = ({ item, index }: { item: SectionData; index: number }) => {
    if (item.type === 'header') {
      return (
        <Animated.View entering={FadeInDown.delay(index * 30)}>
          <SectionHeader dateRange={item.data as DateRange} />
        </Animated.View>
      )
    }

    return (
      <Animated.View className='px-4 mb-3' entering={FadeInDown.delay(50 + index * 30)}>
        <AppointmentCard appointment={item.data as Appointment} />
      </Animated.View>
    )
  }

  const keyExtractor = (item: SectionData) => {
    if (item.type === 'header') {
      const dateRange = item.data as DateRange
      return `header-${createDateRangeKey(dateRange)}`
    }
    return `appointment-${(item.data as Appointment).id}`
  }

  if (isLoadingAppointments) {
    return <Loading />
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 p-4 bg-background'>
        <TouchableOpacity onPress={handleGoBack} className='p-1'>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl text-foreground'>Lịch Sử Lịch Hẹn</Text>
      </View>

      <View className='h-2 bg-muted' />

      <FlatList
        data={sectionsData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-20'
        ListEmptyComponent={
          <View className='flex-1 items-center justify-center p-8'>
            <Text className='text-center text-muted-foreground'>Không tìm thấy lịch hẹn</Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className='py-4'>
              <ActivityIndicator size='large' color={PRIMARY_COLOR.LIGHT} />
            </View>
          ) : null
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
    </SafeView>
  )
}
