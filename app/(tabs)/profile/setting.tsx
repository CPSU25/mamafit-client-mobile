import { Redirect } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { useNotifications } from '~/components/providers/notifications.provider'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useLogout } from '~/features/auth/logout/use-logout'
import { useAuth } from '~/hooks/use-auth'

export default function SettingScreen() {
  const { isAuthenticated, isLoading, tokens } = useAuth()
  const { expoPushToken } = useNotifications()
  const { logoutMutation: logout } = useLogout()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/profile' />

  const handleLogout = () => {
    if (!tokens?.refreshToken || !expoPushToken) return
    logout.mutate({ refreshToken: tokens.refreshToken, notificationToken: expoPushToken })
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='p-4'>
        <Button size='sm' variant='outline' onPress={handleLogout}>
          <Text className='text-rose-500 font-inter-medium'>Logout</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}
