import { View } from 'react-native'
import { cn } from '~/lib/utils'

export default function Wrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={cn('flex flex-col gap-2', className)}>{children}</View>
}
