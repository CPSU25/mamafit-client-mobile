import Feather from '@expo/vector-icons/Feather'
import Wrapper from '~/components/wrapper'
import { useRouter } from 'expo-router'
import { Pressable, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants'

export default function HomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView>
      <Wrapper className='bg-primary'>
        <View className='flex flex-row items-center gap-4'>
          <Pressable
            onPress={() => router.push('/search?autoFocus=true')}
            className='flex flex-row flex-1 items-center h-12 border border-input rounded-xl px-3 bg-background'
          >
            <View className='flex flex-row items-center gap-2'>
              <Feather name='search' size={18} color={PRIMARY_COLOR.LIGHT} />
              <Text className='font-roboto text-sm text-muted-foreground'>Tìm kiếm</Text>
            </View>
          </Pressable>
          <View className='flex flex-row items-center gap-6 mr-1.5'>
            <TouchableOpacity onPress={() => router.push('/cart')}>
              <Feather name='shopping-cart' size={22} color='white' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/chat')}>
              <Feather name='message-circle' size={22} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      </Wrapper>
    </SafeAreaView>
  )
}
