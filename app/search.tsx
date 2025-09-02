import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native'
import { useDebounce } from 'use-debounce'
import SafeView from '~/components/safe-view'
import { Icon } from '~/components/ui/icon'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useAutocomplete } from '~/features/dress/hooks/use-autocomplete'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function SearchScreen() {
  const router = useRouter()
  const searchParams = useLocalSearchParams()

  const [nameSearch, setNameSearch] = useState('')
  const [debouncedNameSearch] = useDebounce(nameSearch, 500)

  const { data: autocomplete, isLoading: isLoadingAutocomplete } = useAutocomplete(debouncedNameSearch)

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
        <Input
          placeholder='Tìm kiếm'
          className='flex-1 border-primary'
          editable={true}
          autoFocus={autoFocus}
          value={nameSearch}
          onChangeText={setNameSearch}
        />
      </View>

      <FlatList
        data={autocomplete}
        renderItem={({ item, index }) => (
          <>
            <TouchableOpacity
              className='px-4'
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            >
              <View className='flex-row items-center gap-3'>
                <View className='w-14 h-14 overflow-hidden relative rounded-lg'>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={{
                      width: '100%',
                      height: '180%',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                    resizeMode='cover'
                  />
                </View>
                <Text className='text-sm text-left flex-1'>{item.name}</Text>
              </View>
            </TouchableOpacity>
            {index !== (autocomplete?.length ?? 0) - 1 && <Separator className='mt-3' />}
          </>
        )}
        contentContainerClassName='gap-3'
        ListEmptyComponent={
          isLoadingAutocomplete ? (
            <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} className='mt-14' />
          ) : (
            <Text className='text-sm text-center text-muted-foreground mt-4'>Không có kết quả</Text>
          )
        }
      />
    </SafeView>
  )
}
