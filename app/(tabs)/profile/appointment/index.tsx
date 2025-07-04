import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { FlatList, TouchableOpacity, View } from 'react-native'
import AppointmentCard from '~/components/card/appointment-card'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

export default function AppointmentScreen() {
  const router = useRouter()

  const formattedDate = format(new Date(), 'eeee, MMM d, yyyy')

  const appointments = [1, 2, 3, 4, 5, 6]

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  return (
    <SafeView>
      <View className='flex flex-row justify-between items-center p-4'>
        <View className='flex flex-row items-center gap-4'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-medium text-xl'>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile/appointment/history')}>
          <Feather name='clock' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>
      <View className='bg-muted h-2' />
      <View className='flex flex-col gap-4 p-4'>
        <Button className='flex flex-row items-center gap-2'>
          <Feather name='calendar' size={20} color='white' />
          <Text className='font-inter-medium'>Book Appointment</Text>
        </Button>
        {appointments.length > 0 ? (
          <FlatList
            data={appointments}
            renderItem={({ item, index }) => <AppointmentCard />}
            contentContainerClassName='gap-4 pb-48'
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className='flex-1 items-center mt-48'>
            {SvgIcon.appointment({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
            <Text className='text-muted-foreground text-sm mt-2'>No upcoming appointments for today</Text>
          </View>
        )}
      </View>
    </SafeView>
  )
}
