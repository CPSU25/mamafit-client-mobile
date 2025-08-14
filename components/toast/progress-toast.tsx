import { View } from 'react-native'
import { styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Card } from '../ui/card'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

interface ProgressToastProps {
  currentProgress: number
  title: string
}

export default function ProgressToast({ currentProgress, title }: ProgressToastProps) {
  return (
    <Card className='mx-2' style={styles.container}>
      <View className='flex-row items-center gap-2 px-3 py-1'>
        <View className='size-2 rounded-full bg-primary' />
        <Text className='text-xs font-inter-medium'>System Progress</Text>
      </View>
      <Separator />
      <View className='flex-row items-center gap-3 p-3'>
        <View className='p-2 rounded-xl bg-primary/10'>{SvgIcon.setting2({ size: 24 })}</View>
        <View className='flex-1 gap-1'>
          <Text className='text-sm font-inter-medium' numberOfLines={1}>
            {title}
          </Text>
          <Progress value={currentProgress} />
        </View>
      </View>
    </Card>
  )
}
