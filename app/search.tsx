import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Icon } from '~/components/ui/icon'
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
      <View className='flex flex-row items-center gap-3 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Input placeholder='Tìm kiếm' className='flex-1 border-primary' editable={true} autoFocus={autoFocus} />
      </View>
    </SafeView>
  )
}
