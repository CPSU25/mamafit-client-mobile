import { View } from 'react-native'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Text } from '~/components/ui/text'
import { useGetCurrentUser } from './use-get-current-user'
import { cn } from '~/lib/utils'
import { useAuth } from '~/hooks/use-auth'

const placeholderImage = 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'

export default function CurrentUser() {
  const { data, isLoading } = useGetCurrentUser()
  const { isAuthenticated } = useAuth()

  if (isLoading) return <View className='size-10 rounded-full bg-muted' />

  return (
    <Avatar alt="Zach Nugent's Avatar" className={cn('size-10', isAuthenticated ? 'border-2 border-primary' : '')}>
      <AvatarImage source={{ uri: data?.data?.profilePicture ?? placeholderImage }} />
      <AvatarFallback>
        <Text>ZN</Text>
      </AvatarFallback>
    </Avatar>
  )
}
