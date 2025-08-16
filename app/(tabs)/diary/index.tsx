import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useDebounce } from 'use-debounce'
import SafeView from '~/components/safe-view'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import DiariesList from '~/features/diary/components/lists/diaries-list'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function DiaryScreen() {
  const router = useRouter()
  const [nameSearch, setNameSearch] = useState('')
  const [debouncedNameSearch] = useDebounce(nameSearch, 500)

  return (
    <SafeView>
      {/* Header */}
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-xl font-inter-semibold'>Nhật Ký Của Bạn</Text>
        <TouchableOpacity onPress={() => router.push('/diary/create')}>
          <Feather name='plus' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>
      <View className='bg-muted h-2' />

      {/* Search */}
      <Input
        className='mx-4 mt-4'
        placeholder='Tìm Kiếm'
        StartIcon={<Feather name='search' size={24} color={PRIMARY_COLOR.LIGHT} />}
        value={nameSearch}
        onChangeText={setNameSearch}
      />

      {/* Diaries List */}
      <DiariesList nameSearch={debouncedNameSearch} />
    </SafeView>
  )
}
