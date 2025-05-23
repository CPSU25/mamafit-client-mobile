import Feather from '@expo/vector-icons/Feather'
import DressCard from '~/components/dress-card'
import Wrapper from '~/components/wrapper'
import { useRouter } from 'expo-router'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants'

// Sample data for dresses
const dresses = Array(8)
  .fill(null)
  .map((_, index) => ({
    id: index.toString()
  }))

export default function HomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView>
      <Wrapper>
        {/* Header */}
        <View className='flex flex-row items-center gap-4'>
          <Pressable
            onPress={() => router.push('/search?autoFocus=true')}
            className='flex flex-row flex-1 items-center h-12 border border-input rounded-xl px-3 bg-background'
          >
            <View className='flex flex-row items-center gap-2'>
              <Feather name='search' size={18} color={PRIMARY_COLOR.LIGHT} />
              <Text className='font-inter text-sm text-muted-foreground'>Search</Text>
            </View>
          </Pressable>
          <View className='flex flex-row items-center gap-6 mr-1.5'>
            <TouchableOpacity onPress={() => router.push('/cart')}>
              <Feather name='shopping-cart' size={22} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/chat')}>
              <Feather name='message-circle' size={22} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Carousel */}
        {/* <HomeCarousel /> */}
        {/* List of dresses */}
        <FlatList
          data={dresses}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className='flex-1'>
              <DressCard className='w-full' />
            </View>
          )}
          columnWrapperClassName='gap-2'
          contentContainerClassName='pb-48 gap-2'
        />
      </Wrapper>
    </SafeAreaView>
  )
}
