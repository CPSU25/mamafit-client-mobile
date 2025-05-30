import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { useNotifications } from '~/components/providers/notifications.provider'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useGetCurrentUser } from '~/features/auth/current-user/use-get-current-user'
import { useLogout } from '~/features/auth/logout/use-logout'
import { useAuth } from '~/hooks/use-auth'
import { PRIMARY_COLOR } from '~/lib/constants'

export default function SettingScreen() {
  const { isAuthenticated, isLoading, tokens } = useAuth()
  const { data: user } = useGetCurrentUser()
  const { bottom } = useSafeAreaInsets()
  const router = useRouter()

  const { expoPushToken } = useNotifications()
  const { logoutMutation: logout } = useLogout()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/profile' />

  const handleLogout = () => {
    if (!tokens?.refreshToken || !expoPushToken) return
    logout.mutate({ refreshToken: tokens.refreshToken, notificationToken: expoPushToken })
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Settings</Text>
      </View>
      <View className='bg-muted h-2' />

      <View className='flex flex-col gap-4 p-4'>
        <View className='flex-row items-end'>
          <Feather name='user' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium ml-2.5 flex-1'>Fullname</Text>
          <Text className='text-muted-foreground text-sm'>{user?.data?.fullName}</Text>
        </View>
        <Separator />
        <View className='flex-row items-end'>
          <Feather name='user' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium ml-2.5 flex-1'>Username</Text>
          <Text className='text-muted-foreground text-sm'>{user?.data?.username}</Text>
        </View>
        <Separator />
        <View className='flex-row items-end'>
          <Feather name='mail' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium ml-2.5 flex-1'>Email</Text>
          <Text className='text-muted-foreground text-sm'>{user?.data?.email}</Text>
        </View>
        <Separator />
        <View className='flex-row items-end'>
          <Feather name='phone' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium ml-2.5 flex-1'>Phone number</Text>
          <Text className='text-muted-foreground text-sm'>{user?.data?.phoneNumber}</Text>
        </View>
      </View>
      <View className='flex-1' />
      <View className='p-4' style={{ paddingBottom: bottom + 55 }}>
        <Text className='text-xs text-muted-foreground text-center mb-2'>MamaFit &copy; 2025</Text>
        <Button size='lg' variant='outline' onPress={handleLogout}>
          <Text className='text-rose-500 font-inter-medium'>Logout</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}
