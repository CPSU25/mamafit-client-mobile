import { Mail, Phone, UserRound } from 'lucide-react-native'
import { View } from 'react-native'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Icon } from '~/components/ui/icon'
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

      <View className='flex-row items-center'>
        <View className='p-2 bg-primary/10 rounded-full'>
          <Icon as={UserRound} size={18} color={PRIMARY_COLOR.LIGHT} />
        </View>
        <View className='ml-3 flex-1'>
          <Text className='font-inter-medium text-sm'>Tên tài khoản</Text>
          <Text className='text-xs text-muted-foreground'>Sẽ hiển thị công khai</Text>
        </View>
        <Text className='text-muted-foreground text-xs'>{user.fullName || 'N/A'}</Text>
      </View>
      <Separator />
      <View className='flex-row items-center'>
        <View className='p-2 bg-primary/10 rounded-full'>
          <Icon as={UserRound} size={18} color={PRIMARY_COLOR.LIGHT} />
        </View>
        <View className='ml-3 flex-1'>
          <Text className='font-inter-medium text-sm'>Tên đăng nhập</Text>
          <Text className='text-xs text-muted-foreground'>Dùng để đăng nhập vào hệ thống</Text>
        </View>
        <Text className='text-muted-foreground text-xs'>{user.userName || 'N/A'}</Text>
      </View>
      <Separator />
      <View className='flex-row items-center'>
        <View className='p-2 bg-primary/10 rounded-full'>
          <Icon as={Mail} size={18} color={PRIMARY_COLOR.LIGHT} />
        </View>
        <View className='ml-3 flex-1'>
          <Text className='font-inter-medium text-sm'>Email</Text>
          <Text className='text-xs text-muted-foreground'>Nhận hóa đơn và thông tin khác</Text>
        </View>
        <Text className='text-muted-foreground text-xs'>{user.userEmail || 'N/A'}</Text>
      </View>
      <Separator />
      <View className='flex-row items-center'>
        <View className='p-2 bg-primary/10 rounded-full'>
          <Icon as={Phone} size={18} color={PRIMARY_COLOR.LIGHT} />
        </View>
        <View className='ml-3 flex-1'>
          <Text className='font-inter-medium text-sm'>Số điện thoại</Text>
          <Text className='text-xs text-muted-foreground'>Shipper sẽ gọi điện cho bạn</Text>
        </View>
        <Text className='text-muted-foreground text-xs'>{user.phoneNumber || 'N/A'}</Text>
      </View>
    </View>
  )
}
