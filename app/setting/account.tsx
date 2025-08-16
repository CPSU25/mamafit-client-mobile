import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import { useNotifications } from '~/components/providers/notifications.provider'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useLogout } from '~/features/auth/hooks/use-logout'
import ViewProfile from '~/features/user/components/view-profile'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
import { useAuth } from '~/hooks/use-auth'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function AccountScreen() {
  const router = useRouter()
  const { expoPushToken } = useNotifications()
  const { user, tokens } = useAuth()
  const { data: userProfile, isLoading } = useGetProfile(user?.userId)

  const {
    logoutMutation: { mutate, isPending }
  } = useLogout()

  const handleLogout = async () => {
    if (!tokens?.refreshToken || !expoPushToken) return

    mutate({ refreshToken: tokens.refreshToken, notificationToken: expoPushToken })
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/setting')
    }
  }

  if (isLoading) return <Loading />

  if (!userProfile) return <Redirect href='/profile' />

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Tài Khoản</Text>
      </View>

      <View className='bg-muted h-2' />

      <ViewProfile user={userProfile} />

      <View className='flex-1' />

      <View className='p-4'>
        <Text className='text-xs text-muted-foreground text-center mb-2'>MamaFit &copy; 2025</Text>
        <Button size='lg' variant='outline' onPress={handleLogout} disabled={isPending}>
          <Text className='text-rose-500 font-inter-medium'>{isPending ? 'Đang Đăng Xuất...' : 'Đăng Xuất'}</Text>
        </Button>
      </View>
    </SafeView>
  )
}
