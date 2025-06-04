import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

export default function DiaryCard() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <Animated.View entering={FadeInDown.duration(200).springify()}>
      <Card className='p-1 bg-primary'>
        <LinearGradient
          colors={isDarkColorScheme ? ['#1f2937', '#111827'] : ['#ffffff', '#f8f9fa']}
          className='rounded-xl overflow-hidden'
        >
          <View className='flex flex-col gap-3 p-3'>
            <View className='flex flex-row items-center gap-3 mb-2'>
              <View className={`${isDarkColorScheme ? 'bg-primary/15' : 'bg-primary/10'} p-1.5 rounded-lg`}>
                {SvgIcon.diary({ size: ICON_SIZE.EXTRA_SMALL, color: 'PRIMARY' })}
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
