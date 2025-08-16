import Feather from '@expo/vector-icons/Feather'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Input } from '~/components/ui/input'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function SearchScreen() {
  const router = useRouter()
  const searchParams = useLocalSearchParams()

  const autoFocus = Boolean(searchParams.autoFocus)

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Input placeholder='Tìm Kiếm' className='flex-1 border-primary' editable={true} autoFocus={autoFocus} />
      </View>
    </SafeView>
  )
}
