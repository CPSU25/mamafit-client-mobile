import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'
import { placeholderImage } from '~/lib/constants/constants'
import { cn, isValidUrl } from '~/lib/utils'
import { Permission } from '~/types/common'

interface CurrentUserProps {
  currentUser: Permission | null | undefined
}

export default function CurrentUser({ currentUser }: CurrentUserProps) {
  const { isAuthenticated } = useAuth()

  const profilePicture = currentUser?.profilePicture
  const imageSource = profilePicture && isValidUrl(profilePicture) ? profilePicture : placeholderImage

  return (
    <Avatar
      alt={currentUser?.userName || currentUser?.userEmail || 'avatar'}
      className={cn('size-10', isAuthenticated ? 'border-2 border-primary' : '')}
    >
      <AvatarImage source={{ uri: imageSource }} />
      <AvatarFallback>
        <Text>{currentUser?.userName?.charAt(0) || currentUser?.userEmail.charAt(0)}</Text>
      </AvatarFallback>
    </Avatar>
  )
}
