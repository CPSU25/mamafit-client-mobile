import { MaterialIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { getStatusColor } from '~/features/appointment/utils'
import { styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Appointment } from '~/types/appointment.type'
import { Card } from '../ui/card'
import { Text } from '../ui/text'

interface AppointmentCardProps {
  appointment: Appointment
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const router = useRouter()
  const { bgColor, icon, iconColor, text, barColor } = getStatusColor(appointment.status)

  return (
    <View className='flex-1 flex-row items-center gap-2'>
      <View className='h-[95%] w-2' style={{ backgroundColor: barColor, borderRadius: 9999 }} />
      <TouchableOpacity className='flex-1' onPress={() => router.push(`/profile/appointment/${appointment.id}`)}>
        <Card className='p-2 flex-1' style={styles.container}>
          <View className='flex-1'>
            <View className='flex-row items-center justify-between'>
              <View className={cn('px-2 py-1 rounded-lg flex-row items-center gap-1.5', bgColor)}>
                <MaterialIcons name={icon} size={16} color={iconColor} />
                <Text className='font-inter-medium text-xs'>{text}</Text>
              </View>

              <Text className='text-xs font-inter-medium pr-2'>
                {format(new Date(appointment.bookingTime), 'hh:mm a')}
              </Text>
            </View>
            <Text className='text-lg font-inter-medium my-1' numberOfLines={1}>
              {appointment.branch.name}
            </Text>
            <View className='gap-0.5'>
              <View className='flex-row items-center gap-1.5'>
                <MaterialIcons name='timelapse' size={14} color='black' />
                <Text className='text-xs'>{format(new Date(appointment.bookingTime), 'MMM d, yyyy')}</Text>
              </View>
              <View className='flex-row items-center gap-1.5'>
                <MaterialIcons name='event-note' size={14} color='black' />
                <Text className='text-xs'>
                  Ghi chú:{' '}
                  {appointment.note ? (
                    <Text className='text-xs text-muted-foreground'>{appointment.note}</Text>
                  ) : (
                    <Text className='text-xs text-muted-foreground'>trống</Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  )
}
