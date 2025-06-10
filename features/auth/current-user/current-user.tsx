import { View } from 'react-native'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'
import { useRefreshOnFocus } from '~/hooks/use-refresh-on-focus'
import { cn, isValidUrl } from '~/lib/utils'
import { useGetCurrentUser } from './use-get-current-user'
import { placeholderImage } from '~/lib/constants/constants'

export default function CurrentUser() {
  const { data, isLoading, refetch } = useGetCurrentUser()
  const { isAuthenticated } = useAuth()

  useRefreshOnFocus(refetch)

  if (isLoading) return <View className='size-10 rounded-full bg-muted' />

  const profilePicture = data?.data?.profilePicture
  const imageSource = profilePicture && isValidUrl(profilePicture) ? profilePicture : placeholderImage

  return (
    <Avatar
      alt={data?.data?.userName || data?.data?.userEmail || 'avatar'}
      className={cn('size-10', isAuthenticated ? 'border-2 border-primary' : '')}
    >
      <AvatarImage source={{ uri: imageSource }} />
      <AvatarFallback>
        <Text>{data?.data?.userName?.charAt(0) || data?.data?.userEmail.charAt(0)}</Text>
      </AvatarFallback>
    </Avatar>
  )
}
