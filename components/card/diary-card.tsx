import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { getShadowStyles, ICON_SIZE, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

export default function DiaryCard() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <LinearGradient
      colors={isDarkColorScheme ? ['#8a5cd7 ', '#5a32a3 '] : ['#b983ef', '#8747e1']}
      className='rounded-2xl overflow-hidden p-1'
      style={[styles.container, getShadowStyles('#6d28d9')]}
    >
      <View className='flex flex-col gap-3 p-3 bg-card rounded-xl'>
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
      <Text className='text-xs text-white/90 text-right font-inter-semibold lowercase my-2 px-4'>
        Updated 12 hours ago
      </Text>
    </LinearGradient>
  )
}
