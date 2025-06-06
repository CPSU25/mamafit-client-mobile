import { View } from 'react-native'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'
import { useRefreshOnFocus } from '~/hooks/use-refresh-on-focus'
import { cn } from '~/lib/utils'
import { useGetCurrentUser } from './use-get-current-user'

const placeholderImage = 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'

const isValidUrl = (url: unknown) => {
  if (typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export default function CurrentUser() {
  const { data, isLoading, refetch } = useGetCurrentUser()
  const { isAuthenticated } = useAuth()

  useRefreshOnFocus(refetch)

  if (isLoading) return <View className='size-10 rounded-full bg-muted' />

  const profilePicture = data?.data?.profilePicture
  const imageSource = profilePicture && isValidUrl(profilePicture) ? profilePicture : placeholderImage

  return (
    <Avatar alt="Zach Nugent's Avatar" className={cn('size-10', isAuthenticated ? 'border-2 border-primary' : '')}>
      <AvatarImage source={{ uri: imageSource }} />
      <AvatarFallback>
        <Text>ZN</Text>
      </AvatarFallback>
    </Avatar>
  )
}
