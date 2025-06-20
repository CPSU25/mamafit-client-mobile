import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Text } from '../ui/text'

export default function AppointmentCard() {
  const router = useRouter()

  return (
    <Card className='p-4'>
      <View className='flex flex-row items-start gap-10'>
        <View className='flex-1'>
          <Text className='text-lg font-inter-medium' numberOfLines={1}>
            Appointment with John Doe
          </Text>
          <View className='flex flex-col gap-1.5 mt-2.5'>
            <View className='flex flex-row items-center gap-1.5'>
              <Feather name='clock' size={16} color={PRIMARY_COLOR.LIGHT} />
              <Text className='text-xs text-muted-foreground'>{format(new Date(), 'MMM d, yyyy')} at 10:00 AM</Text>
            </View>
            <View className='flex flex-row items-center gap-1.5'>
              <Feather name='map-pin' size={16} color={PRIMARY_COLOR.LIGHT} />
              <Text className='text-xs text-muted-foreground' numberOfLines={1}>
                385A Man Thiện, Phường Tân Phú, Thủ Đức, Thành phố Hồ Chí Minh
              </Text>
            </View>
          </View>
        </View>
        <Avatar alt="Zach Nugent's Avatar" className='size-10'>
          <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
          <AvatarFallback>
            <Text>ZN</Text>
          </AvatarFallback>
        </Avatar>
      </View>
      <View className='flex flex-row items-center gap-2 mt-4'>
        <Button variant='outline' size='sm' className='flex-1'>
          <Text className='text-rose-500 font-inter-medium'>Cancel</Text>
        </Button>
        <Button
          variant='default'
          className='flex-[2]'
          size='sm'
          onPress={() => router.push({ pathname: '/profile/appointment/[id]', params: { id: '1' } })}
        >
          <Text className='font-inter-medium'>More</Text>
        </Button>
      </View>
    </Card>
  )
}
