import { Feather } from '@expo/vector-icons'
import { View } from 'react-native'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { placeholderImage, PRIMARY_COLOR } from '~/lib/constants/constants'
import { isValidUrl } from '~/lib/utils'
import { User } from '~/types/common'

interface ViewProfileProps {
  user: User
}

export default function ViewProfile({ user }: ViewProfileProps) {
  const imageSource = user.profilePicture && isValidUrl(user.profilePicture) ? user.profilePicture : placeholderImage

  return (
    <View className='flex flex-col gap-4 p-4'>
      <Avatar alt={user.fullName || user.userEmail} className='size-14 mb-4'>
        <AvatarImage source={{ uri: imageSource }} />
        <AvatarFallback>
          <Text>{user.fullName?.charAt(0) || user.userEmail.charAt(0)}</Text>
        </AvatarFallback>
      </Avatar>

      <View className='flex-row items-end'>
        <Feather name='user' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5 flex-1'>Fullname</Text>
        <Text className='text-muted-foreground text-sm'>{user.fullName || 'N/A'}</Text>
      </View>
      <Separator />
      <View className='flex-row items-end'>
        <Feather name='user' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5 flex-1'>Username</Text>
        <Text className='text-muted-foreground text-sm'>{user.userName || 'N/A'}</Text>
      </View>
      <Separator />
      <View className='flex-row items-end'>
        <Feather name='mail' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5 flex-1'>Email</Text>
        <Text className='text-muted-foreground text-sm'>{user.userEmail || 'N/A'}</Text>
      </View>
      <Separator />
      <View className='flex-row items-end'>
        <Feather name='phone' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5 flex-1'>Phone number</Text>
        <Text className='text-muted-foreground text-sm'>{user.phoneNumber || 'N/A'}</Text>
      </View>
    </View>
  )
}
