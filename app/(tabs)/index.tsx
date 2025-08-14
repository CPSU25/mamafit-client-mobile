import Feather from '@expo/vector-icons/Feather'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import DressCard from '~/components/card/dress-card'
import HomeCarousel from '~/components/home-carousel'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'

// Sample data for dresses
const dresses = Array(50)
  .fill(null)
  .map((_, index) => ({
    id: index.toString()
  }))

const dressStyles = ['All', 'Maxi', 'Wrap', 'Bodycon', 'A-Line', 'Midi', 'Shirt', 'Boho', 'Smocked', 'Shift', 'Tiered']

export default function HomeScreen() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [currentStyle, setCurrentStyle] = useState('All')

  const handleScroll = useCallback((event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    setScrollY(currentScrollY)
  }, [])

  return (
    <SafeView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        onScroll={handleScroll}
        scrollEventThrottle={50}
        nestedScrollEnabled
        className='bg-muted'
      >
        <View className='flex-1'>
          {/* Header */}
          <View className='flex flex-row items-center gap-4 px-4 py-2 bg-background'>
            <Pressable
              onPress={() => router.push('/search?autoFocus=true')}
              className='flex flex-row flex-1 items-center h-12 border border-input rounded-xl px-3 bg-background'
            >
              <View className='flex flex-row items-center gap-2'>
                <Feather name='search' size={18} color={PRIMARY_COLOR.LIGHT} />
                <Text className='font-inter text-sm text-muted-foreground'>Search</Text>
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

          {/* Carousel */}
          <HomeCarousel />

          <View className='px-4 pb-4 pt-2 bg-background'>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName='gap-2'
              nestedScrollEnabled
            >
              {dressStyles.map((item) => (
                <TouchableOpacity
                  key={item}
                  className={cn(
                    'px-4 py-1 bg-muted rounded-lg border border-border',
                    currentStyle === item && 'bg-primary/10 border-primary/20'
                  )}
                  onPress={() => setCurrentStyle(item)}
                >
                  <Text
                    className={cn(
                      'text-sm font-inter-medium opacity-70',
                      currentStyle === item && 'text-primary opacity-100'
                    )}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* TODO: add quick access buttons like booking appointment, create diary, ... */}

          <View className='gap-2 p-4'>
            <View className='flex-row gap-2'>
              {/* Left Column */}
              <View className='flex-1 gap-2'>
                {dresses
                  .filter((_, index) => index % 2 === 0)
                  .map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() =>
                        router.push({
                          pathname: '/product/[id]',
                          params: { id: item.id }
                        })
                      }
                    >
                      <DressCard isLeftColumn={true} scrollY={scrollY} />
                    </TouchableOpacity>
                  ))}
              </View>

              {/* Right Column */}
              <View className='flex-1 gap-2'>
                {dresses
                  .filter((_, index) => index % 2 === 1)
                  .map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() =>
                        router.push({
                          pathname: '/product/[id]',
                          params: { id: item.id }
                        })
                      }
                    >
                      <DressCard isLeftColumn={false} scrollY={scrollY} />
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
            <Text className='text-center text-muted-foreground text-xs mt-4'>No more products</Text>
          </View>
        </View>
      </ScrollView>
    </SafeView>
  )
}
