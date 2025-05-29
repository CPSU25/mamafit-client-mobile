import { AntDesign } from '@expo/vector-icons'
import { View } from 'react-native'
import { Text } from './ui/text'

interface FieldErrorProps {
  message: string
}

export default function FieldError({ message }: FieldErrorProps) {
  return (
    <View className='flex flex-row items-baseline gap-2'>
      {message && <AntDesign name='closecircle' size={13} color='#f43f5e' />}
      <Text className='text-rose-500 text-sm flex-1 font-inter-medium'>{message}</Text>
    </View>
  )
}
