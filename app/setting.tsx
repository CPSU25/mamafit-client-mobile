import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { useNotifications } from '~/components/providers/notifications.provider'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useLogout } from '~/features/auth/logout/use-logout'
import { useGetProfile } from '~/features/user/view-profile/use-get-profile'
import ViewProfile from '~/features/user/view-profile/view-profile'
import { useAuth } from '~/hooks/use-auth'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

// TODO: Refactor this screen

export default function SettingScreen() {
  const { isAuthenticated, isLoading: isAuthLoading, tokens, user } = useAuth()
  const { data: userProfile, isLoading: isProfileLoading } = useGetProfile(user?.userId)
  const router = useRouter()

  const { expoPushToken } = useNotifications()
  const {
    logoutMutation: { mutate, isPending }
  } = useLogout()

  const isLoading = isAuthLoading || isProfileLoading

  if (!isAuthenticated && !isLoading) return <Redirect href='/profile' />

  const handleLogout = async () => {
    if (!tokens?.refreshToken || !expoPushToken) return

    mutate({ refreshToken: tokens.refreshToken, notificationToken: expoPushToken })
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

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {userProfile?.data && <ViewProfile user={userProfile.data} />}
          <View className='flex-1' />
          <View className='p-4'>
            <Text className='text-xs text-muted-foreground text-center mb-2'>MamaFit &copy; 2025</Text>
            <Button size='lg' variant='outline' onPress={handleLogout} disabled={isPending}>
              <Text className='text-rose-500 font-inter-medium'>{isPending ? 'Logging out...' : 'Logout'}</Text>
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}
