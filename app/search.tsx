import Wrapper from '~/components/wrapper'
import Feather from '@expo/vector-icons/Feather'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input } from '~/components/ui/input'

export default function SearchScreen() {
  const router = useRouter()
  const searchParams = useLocalSearchParams()

  const autoFocus = Boolean(searchParams.autoFocus)

  const handleGoBack = () => {
    router.back()
  }

  return (
    <SafeAreaView>
      <Wrapper className='px-3'>
        <View className='flex flex-row items-center gap-3'>
          <Pressable onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color='hsl(221.2 83.2% 53.3%)' />
          </Pressable>
          <Input
            placeholder='Tìm kiếm'
            className='placeholder:text-sm flex-1 border-primary'
            editable={true}
            autoFocus={autoFocus}
          />
        </View>
      </Wrapper>
    </SafeAreaView>
  )
}
