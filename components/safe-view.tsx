import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cn } from '~/lib/utils'
interface SafeViewProps {
  children: React.ReactNode
  className?: string
}

export default function SafeView({ children, className }: SafeViewProps) {
  const insets = useSafeAreaInsets()

  return (
    <View className={cn('flex-1', className)} style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {children}
    </View>
  )
}
