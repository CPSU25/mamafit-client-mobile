import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import DiaryCard from '~/components/card/diary-card'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

export default function MeasurementDiaryScreen() {
  const router = useRouter()

  const diaries = [1, 2, 3, 4, 5]

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-xl font-inter-semibold'>Your Diary</Text>
        <TouchableOpacity onPress={() => router.push('/diary/create')}>
          <Feather name='plus' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>

      <View className='bg-muted h-2' />
      <View className='flex flex-col gap-4'>
        {diaries.length > 0 ? (
          <Animated.View entering={FadeInDown.duration(300).springify()}>
            <FlatList
              data={diaries}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => router.push('/diary/1')}>
                  <DiaryCard />
                </Pressable>
              )}
              contentContainerClassName='gap-4 p-4 pb-36'
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        ) : (
          <View className='flex items-center px-4 mt-48'>
            {SvgIcon.diary({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
            <Text className='text-muted-foreground text-sm mt-2'>Create your first diary to get started!</Text>
            <Button size='sm' className='mt-8 flex flex-row items-center gap-2'>
              <Feather name='plus' size={16} color='white' />
              <Text className='font-inter-medium'>Create Diary</Text>
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
