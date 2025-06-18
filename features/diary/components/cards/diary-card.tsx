import { format, formatDistanceToNow } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { getShadowStyles, ICON_SIZE, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Diary } from '~/types/diary.type'

interface DiaryCardProps {
  diary: Diary
}

export default function DiaryCard({ diary }: DiaryCardProps) {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <LinearGradient
      colors={isDarkColorScheme ? ['#5b21b6 ', '#7c3aed'] : ['#6d28d9', '#8b5cf6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className='rounded-2xl overflow-hidden'
      style={[styles.container, getShadowStyles()]}
    >
      <Text className='text-xs text-white text-right lowercase font-inter-semibold pr-4 my-1'>
        Updated {formatDistanceToNow(diary.updatedAt, { addSuffix: true })}
      </Text>
      <View
        className='flex flex-col gap-2 p-2 bg-card rounded-2xl'
        style={{
          boxShadow: '0 12px 22px 8px rgba(0, 0, 0, 0.6)'
        }}
      >
        <View className='flex flex-row items-center gap-3'>
          <View className={`${isDarkColorScheme ? 'bg-primary/15' : 'bg-primary/10'} p-1.5 rounded-lg`}>
            {SvgIcon.diary({ size: ICON_SIZE.EXTRA_SMALL, color: 'PRIMARY' })}
          </View>
          <View>
            <Text className='font-inter-medium' numberOfLines={1}>
              {diary.name}
            </Text>
            <Text className='text-xs text-muted-foreground'>Created At: {format(diary.createdAt, 'dd/MM/yyyy')}</Text>
          </View>
        </View>

        <View
          className={`flex flex-row items-center gap-3 ${isDarkColorScheme ? 'bg-background/30' : 'bg-background/90'} p-1 rounded-xl border border-input/30`}
        >
          <View className='flex-1 items-center'>
            <Text
              className={`text-xs ${isDarkColorScheme ? 'text-muted-foreground/80' : 'text-muted-foreground'} font-inter-medium mb-1`}
            >
              Weight
            </Text>
            <Text className={`text-sm font-inter-medium ${isDarkColorScheme ? 'text-white' : 'text-foreground'}`}>
              {diary.weight} kg
            </Text>
          </View>
          <Separator orientation='vertical' className='h-6' />
          <View className='flex-1 items-center'>
            <Text
              className={`text-xs ${isDarkColorScheme ? 'text-muted-foreground/80' : 'text-muted-foreground'} font-inter-medium mb-1`}
            >
              Height
            </Text>
            <Text className={`text-sm font-inter-medium ${isDarkColorScheme ? 'text-white' : 'text-foreground'}`}>
              {diary.height} cm
            </Text>
          </View>
          <Separator orientation='vertical' className='h-6' />
          <View className='flex-1 items-center'>
            <Text
              className={`text-xs ${isDarkColorScheme ? 'text-muted-foreground/80' : 'text-muted-foreground'} font-inter-medium mb-1`}
            >
              Pregnancy
            </Text>
            <Text className={`text-sm font-inter-medium ${isDarkColorScheme ? 'text-white' : 'text-foreground'}`}>
              {diary.numberOfPregnancy}
              {diary.numberOfPregnancy === 1
                ? 'st'
                : diary.numberOfPregnancy === 2
                  ? 'nd'
                  : diary.numberOfPregnancy === 3
                    ? 'rd'
                    : 'th'}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}
