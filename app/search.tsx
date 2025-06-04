import Feather from '@expo/vector-icons/Feather'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input } from '~/components/ui/input'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function SearchScreen() {
  const router = useRouter()
  const searchParams = useLocalSearchParams()

  const autoFocus = Boolean(searchParams.autoFocus)

  const handleGoBack = () => {
    router.back()
  }

  return (
    <SafeAreaView>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Input placeholder='Search' className='flex-1 border-primary' editable={true} autoFocus={autoFocus} />
      </View>
    </SafeAreaView>
  )
}
