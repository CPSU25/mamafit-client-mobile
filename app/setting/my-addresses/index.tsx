import { AntDesign, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function MyAddressesScreen() {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/setting')
    }
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>My Addresses</Text>
      </View>

      <View className='bg-muted h-2' />

      <View className='p-4'>
        <Button
          variant='outline'
          className='flex-row items-center gap-2'
          onPress={() => router.push('/setting/my-addresses/create')}
        >
          <AntDesign name='pluscircleo' size={14} color={isDarkColorScheme ? 'white' : 'black'} />
          <Text className='native:text-sm font-inter-medium'>Add Address</Text>
        </Button>
      </View>
    </SafeView>
  )
}
