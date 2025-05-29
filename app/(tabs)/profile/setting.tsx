import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'

export default function SettingScreen() {
  const { handleLogout } = useAuth()

  return (
    <SafeAreaView>
      <Button onPress={handleLogout} size='sm' variant='outline'>
        <Text className='text-rose-500 font-inter-medium'>Logout</Text>
      </Button>
    </SafeAreaView>
  )
}
