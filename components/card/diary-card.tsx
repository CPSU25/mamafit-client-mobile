import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Svg, { G, Path } from 'react-native-svg'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE } from '~/lib/constants'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

export default function DiaryCard() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()}>
      <Card className='p-1 bg-primary'>
        <LinearGradient
          colors={isDarkColorScheme ? ['#1f2937', '#111827'] : ['#ffffff', '#f8f9fa']}
          className='rounded-xl overflow-hidden'
        >
          <View className='flex flex-col gap-3 p-3'>
            <View className='flex flex-row items-center gap-3 mb-2'>
              <View className={`${isDarkColorScheme ? 'bg-primary/15' : 'bg-primary/10'} p-1.5 rounded-lg`}>
                <Svg width={ICON_SIZE.EXTRA_SMALL} height={ICON_SIZE.EXTRA_SMALL} viewBox='0 0 24 24' fill='none'>
                  <G id='SVGRepo_bgCarrier' stroke-width='0'></G>
                  <G id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></G>
                  <G id='SVGRepo_iconCarrier'>
                    <Path
                      opacity='0.4'
                      d='M20.5 7V15H6.35C4.78 15 3.5 16.28 3.5 17.85V7C3.5 3 4.5 2 8.5 2H15.5C19.5 2 20.5 3 20.5 7Z'
                      fill='#6d28d9'
                    ></Path>
                    <Path
                      d='M20.5 15V18.5C20.5 20.43 18.93 22 17 22H7C5.07 22 3.5 20.43 3.5 18.5V17.85C3.5 16.28 4.78 15 6.35 15H20.5Z'
                      fill='#6d28d9'
                    ></Path>
                    <Path
                      d='M16 7.75H8C7.59 7.75 7.25 7.41 7.25 7C7.25 6.59 7.59 6.25 8 6.25H16C16.41 6.25 16.75 6.59 16.75 7C16.75 7.41 16.41 7.75 16 7.75Z'
                      fill='#6d28d9'
                    ></Path>
                    <Path
                      d='M13 11.25H8C7.59 11.25 7.25 10.91 7.25 10.5C7.25 10.09 7.59 9.75 8 9.75H13C13.41 9.75 13.75 10.09 13.75 10.5C13.75 10.91 13.41 11.25 13 11.25Z'
                      fill='#6d28d9'
                    ></Path>
                  </G>
                </Svg>
              </View>
              <Text className={`text-xl font-inter-semibold`} numberOfLines={1}>
                Nguyen Thi Van Anh
              </Text>
            </View>

            <View
              className={`flex flex-row items-center gap-3 ${isDarkColorScheme ? 'bg-background/30' : 'bg-background/90'} p-2 rounded-lg border border-input/30`}
            >
              <View className='flex-1 items-center'>
                <Text
                  className={`text-xs ${isDarkColorScheme ? 'text-muted-foreground/80' : 'text-muted-foreground'} font-inter-medium mb-1`}
                >
                  Weight
                </Text>
                <Text className={`text-sm font-inter-semibold ${isDarkColorScheme ? 'text-white' : 'text-foreground'}`}>
                  40.00 kg
                </Text>
              </View>
              <Separator orientation='vertical' className='h-8' />
              <View className='flex-1 items-center'>
                <Text
                  className={`text-xs ${isDarkColorScheme ? 'text-muted-foreground/80' : 'text-muted-foreground'} font-inter-medium mb-1`}
                >
                  Height
                </Text>
                <Text className={`text-sm font-inter-semibold ${isDarkColorScheme ? 'text-white' : 'text-foreground'}`}>
                  190.00 cm
                </Text>
              </View>
              <Separator orientation='vertical' className='h-8' />
              <View className='flex-1 items-center'>
                <Text
                  className={`text-xs ${isDarkColorScheme ? 'text-muted-foreground/80' : 'text-muted-foreground'} font-inter-medium mb-1`}
                >
                  Pregnancy
                </Text>
                <Text className={`text-sm font-inter-semibold ${isDarkColorScheme ? 'text-white' : 'text-foreground'}`}>
                  2nd
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <Text className='text-xs text-white/90 text-right font-inter-semibold lowercase my-2 px-2'>
          Updated 12 hours ago
        </Text>
      </Card>
    </Animated.View>
  )
}
