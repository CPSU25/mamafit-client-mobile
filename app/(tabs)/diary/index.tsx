import { Feather } from '@expo/vector-icons'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { G, Path } from 'react-native-svg'
import DiaryCard from '~/components/card/diary-card'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useGetCurrentUser } from '~/features/auth/current-user/use-get-current-user'

import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants'

export default function MeasurementDiaryScreen() {
  const { data: currentUser } = useGetCurrentUser()

  const diaries = [1, 2, 3, 4, 5, 6]

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-xl font-inter-semibold'>Hello {currentUser?.data?.fullName} 👋</Text>
        <TouchableOpacity>
          <Feather name='plus' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>

      <View className='bg-muted h-2' />
      <View className='flex flex-col gap-4 p-4'>
        {diaries.length > 0 ? (
          <FlatList
            data={diaries}
            renderItem={({ item, index }) => (
              <TouchableOpacity>
                <DiaryCard />
              </TouchableOpacity>
            )}
            contentContainerClassName='gap-4 pb-32'
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className='flex items-center px-4 mt-48'>
            <Svg width={ICON_SIZE.EXTRA_LARGE} height={ICON_SIZE.EXTRA_LARGE} viewBox='0 0 24 24' fill='none'>
              <G id='SVGRepo_bgCarrier' stroke-width='0'></G>
              <G id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></G>
              <G id='SVGRepo_iconCarrier'>
                <Path
                  opacity='0.4'
                  d='M20.5 7V15H6.35C4.78 15 3.5 16.28 3.5 17.85V7C3.5 3 4.5 2 8.5 2H15.5C19.5 2 20.5 3 20.5 7Z'
                  fill='#C4C8CC'
                ></Path>
                <Path
                  d='M20.5 15V18.5C20.5 20.43 18.93 22 17 22H7C5.07 22 3.5 20.43 3.5 18.5V17.85C3.5 16.28 4.78 15 6.35 15H20.5Z'
                  fill='#C4C8CC'
                ></Path>
                <Path
                  d='M16 7.75H8C7.59 7.75 7.25 7.41 7.25 7C7.25 6.59 7.59 6.25 8 6.25H16C16.41 6.25 16.75 6.59 16.75 7C16.75 7.41 16.41 7.75 16 7.75Z'
                  fill='#C4C8CC'
                ></Path>
                <Path
                  d='M13 11.25H8C7.59 11.25 7.25 10.91 7.25 10.5C7.25 10.09 7.59 9.75 8 9.75H13C13.41 9.75 13.75 10.09 13.75 10.5C13.75 10.91 13.41 11.25 13 11.25Z'
                  fill='#C4C8CC'
                ></Path>
              </G>
            </Svg>
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
