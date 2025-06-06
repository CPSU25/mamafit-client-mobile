import { AntDesign } from '@expo/vector-icons'
import { View } from 'react-native'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { cn } from '~/lib/utils'
import { Text } from './ui/text'

interface FieldErrorProps {
  message: string
}

export default function FieldError({ message }: FieldErrorProps) {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <View
      className={cn(
        'p-4 rounded-2xl',
        isDarkColorScheme ? 'bg-rose-950/60 border border-rose-500/20' : 'bg-rose-100/60 border border-rose-200'
      )}
    >
      <View className='flex flex-row items-center gap-3'>
        {message && <AntDesign name='exclamationcircle' size={16} color='#B22222' />}
        <Text className={cn('text-sm flex-1 font-inter-medium', isDarkColorScheme ? 'text-white/80' : 'text-black/80')}>
          {message}
        </Text>
      </View>
    </View>
  )
}
