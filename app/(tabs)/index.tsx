import Feather from '@expo/vector-icons/Feather'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import DressesList from '~/features/dress/components/dresses-list'
import { useGetStyles } from '~/features/dress/hooks/use-get-styles'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'

export default function HomeScreen() {
  const router = useRouter()
  const [currentStyle, setCurrentStyle] = useState('all')

  const { data: styles } = useGetStyles()

  const ListHeaderComponent = useCallback(
    () => (
      <View className='px-4 pt-2 pb-6 bg-background gap-4 mb-2'>
        <View className='flex-row gap-3'>
          <TouchableOpacity className='relative flex-1' onPress={() => router.push('/diary/create')}>
            <LinearGradient
              colors={['#60a5fa', '#3b82f6', '#1d4ed8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.6)'
              }}
              className='rounded-2xl overflow-hidden p-4 z-10 border border-blue-400'
            >
              <BlurView intensity={3} tint='dark' className='absolute inset-0 rounded-2xl' />
              <View className='absolute top-1 right-3 w-6 h-6 bg-white/10 rounded-full' />
              <View className='absolute top-6 right-1 w-4 h-4 bg-white/15 rounded-full' />
              <View className='absolute top-2 left-2 w-3 h-3 bg-white/10 rounded-full' />
              <View className='absolute bottom-2 right-6 w-5 h-5 bg-white/5 rounded-full' />
              <View className='z-10'>
                <Text className='font-inter-semibold text-white text-sm'>Tạo Nhật Ký</Text>
                <Text className='text-white text-[10px] relative z-10'>Ghi lại số đo của bạn</Text>
              </View>
            </LinearGradient>
            <View className='absolute left-[5%] -bottom-1 bg-blue-300/50 rounded-md h-3 w-[90%]' />
          </TouchableOpacity>

          <TouchableOpacity className='relative flex-1' onPress={() => router.push('/profile/appointment')}>
            <LinearGradient
              colors={['#34d399', '#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.6)'
              }}
              className='rounded-2xl overflow-hidden p-4 z-10 border border-emerald-400'
            >
              <BlurView intensity={3} tint='dark' className='absolute inset-0 rounded-2xl' />
              <View className='absolute top-3 right-2 w-5 h-5 bg-white/15 rounded-full' />
              <View className='absolute top-1 left-4 w-4 h-4 bg-white/10 rounded-full' />
              <View className='absolute bottom-1 right-4 w-3 h-3 bg-white/5 rounded-full' />
              <View className='absolute top-7 right-7 w-6 h-6 bg-white/10 rounded-full' />
              <View className='absolute bottom-3 left-1 w-4 h-4 bg-white/5 rounded-full' />
              <View className='z-10'>
                <Text className='font-inter-semibold text-white text-sm'>Lịch Hẹn</Text>
                <Text className='text-white text-[10px] relative z-10'>Đặt lịch đo tại chi nhánh</Text>
              </View>
            </LinearGradient>
            <View className='absolute left-[5%] -bottom-1 bg-emerald-300/50 rounded-md h-3 w-[90%]' />
          </TouchableOpacity>
        </View>

        <View className='flex-row gap-3'>
          <TouchableOpacity className='relative flex-1' onPress={() => router.push('/design-request/create')}>
            <LinearGradient
              colors={['#f472b6', '#ec4899', '#db2777']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.6)'
              }}
              className='rounded-2xl overflow-hidden p-4 z-10 border border-pink-400'
            >
              <BlurView intensity={3} tint='dark' className='absolute inset-0 rounded-2xl' />
              <View className='absolute top-2 left-6 w-4 h-4 bg-white/15 rounded-full' />
              <View className='absolute top-5 right-3 w-6 h-6 bg-white/10 rounded-full' />
              <View className='absolute bottom-2 left-2 w-5 h-5 bg-white/20 rounded-full' />
              <View className='absolute top-1 right-8 w-3 h-3 bg-white/10 rounded-full' />
              <View className='z-10'>
                <Text className='font-inter-semibold text-white text-sm'>Yêu Cầu Thiết Kế</Text>
                <Text className='text-white text-[10px] relative z-10'>Gửi ý tưởng thiết kế</Text>
              </View>
            </LinearGradient>
            <View className='absolute left-[5%] -bottom-1 bg-pink-300/50 rounded-md h-3 w-[90%]' />
          </TouchableOpacity>

          <TouchableOpacity className='relative flex-1' onPress={() => router.push('/order/status/confirmed')}>
            <LinearGradient
              colors={['#a78bfa', '#8b5cf6', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.6)'
              }}
              className='rounded-2xl overflow-hidden p-4 z-10 border border-violet-400'
            >
              <BlurView intensity={3} tint='dark' className='absolute inset-0 rounded-2xl' />
              <View className='absolute top-3 left-3 w-5 h-5 bg-white/20 rounded-full' />
              <View className='absolute top-1 right-5 w-4 h-4 bg-white/10 rounded-full' />
              <View className='absolute bottom-3 right-2 w-6 h-6 bg-white/15 rounded-full' />
              <View className='absolute top-6 left-1 w-3 h-3 bg-white/5 rounded-full' />
              <View className='absolute bottom-1 left-7 w-4 h-4 bg-white/10 rounded-full' />

              <View className='z-10'>
                <Text className='font-inter-semibold text-white text-sm'>Xem đơn hàng</Text>
                <Text className='text-white text-[10px] relative z-10'>Trạng thái đơn chi tiết</Text>
              </View>
            </LinearGradient>
            <View className='absolute left-[5%] -bottom-1 bg-violet-300/50 rounded-md h-3 w-[90%]' />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [router]
  )

  const stylesData = useMemo(
    () => [{ id: 'all', name: 'Tất cả' }, ...(styles?.pages.flatMap((page) => page.items) ?? [])],
    [styles]
  )

  const stylesListRef = useRef<FlatList<any>>(null)
  const selectedIndex = useMemo(
    () => stylesData.findIndex((item) => item.id === currentStyle),
    [stylesData, currentStyle]
  )

  useEffect(() => {
    if (selectedIndex > -1) {
      stylesListRef.current?.scrollToIndex({ index: selectedIndex, animated: true, viewPosition: 0.5 })
    }
  }, [selectedIndex])

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 px-4 py-2 bg-background'>
        <Pressable
          onPress={() => router.push('/search?autoFocus=true')}
          className='flex flex-row flex-1 items-center h-11 border border-input rounded-xl px-3 bg-background'
        >
          <View className='flex flex-row items-center gap-2'>
            <Feather name='search' size={18} color={PRIMARY_COLOR.LIGHT} />
            <Text className='text-sm text-muted-foreground'>Tìm kiếm</Text>
          </View>
        </Pressable>
        <View className='flex flex-row items-center gap-6 mr-2'>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Feather name='shopping-bag' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/chat')}>
            <Feather name='message-circle' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
        </View>
      </View>

      <View className='px-4 pt-1 pb-2 bg-background'>
        <FlatList
          ref={stylesListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          data={stylesData}
          keyExtractor={(item) => item.id}
          initialScrollIndex={selectedIndex > -1 ? selectedIndex : 0}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              stylesListRef.current?.scrollToIndex({ index: info.index, animated: true })
            }, 100)
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={cn(
                'px-4 py-1 bg-muted rounded-lg border border-border',
                currentStyle === item.id && 'bg-primary/10 border-primary/20'
              )}
              onPress={() =>
                setCurrentStyle((prev) => {
                  if (prev === item.id) {
                    return 'all'
                  }
                  return item.id
                })
              }
            >
              <Text
                className={cn(
                  'text-sm font-inter-medium opacity-70',
                  currentStyle === item.id && 'text-primary opacity-100'
                )}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <DressesList headerComponent={ListHeaderComponent} styleId={currentStyle === 'all' ? undefined : currentStyle} />
    </SafeView>
  )
}
