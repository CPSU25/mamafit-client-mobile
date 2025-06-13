import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import DiaryCard from '~/components/card/diary-card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

export default function MeasurementDiaryScreen() {
  const router = useRouter()

  const diaries = [1, 2, 3, 4, 5, 6]

  return (
    <SafeAreaView className='flex-1' edges={['top']}>
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-xl font-inter-semibold'>Your Diary</Text>
        <TouchableOpacity onPress={() => router.push('/diary/create')}>
          <Feather name='plus' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>

      <View className='bg-muted h-2' />

      <Input
        className='mx-4 mt-4'
        placeholder='Search'
        StartIcon={<Feather name='search' size={24} color={PRIMARY_COLOR.LIGHT} />}
      />

      <View className='flex flex-col gap-4 mt-4'>
        <FlatList
          data={diaries}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.duration(200).delay(index * 100)}>
              <Pressable onPress={() => router.push('/diary/detail/1')}>
                <DiaryCard />
              </Pressable>
            </Animated.View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName='gap-4 p-4 pb-60'
          ListEmptyComponent={
            <View className='flex items-center px-4 mt-48'>
              {SvgIcon.diary({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
              <Text className='text-muted-foreground text-sm mt-2'>Create your first diary to get started!</Text>
              <Button size='sm' className='mt-8 flex flex-row items-center gap-2'>
                <Feather name='plus' size={16} color='white' />
                <Text className='font-inter-medium'>Create Diary</Text>
              </Button>
            </View>
          }
          contentInsetAdjustmentBehavior='automatic'
        />
      </View>
    </SafeAreaView>
  )
}
