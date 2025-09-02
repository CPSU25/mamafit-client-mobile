import { useRouter } from 'expo-router'
import { Home } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'
import { Icon } from './ui/icon'

interface BackToHomeButtonProps {
  color?: string
  size?: number
  className?: string
}

export default function BackToHomeButton({ color, size, className }: BackToHomeButtonProps) {
  const router = useRouter()

  const handleBackToHome = () => {
    router.replace('/')
  }

  return (
    <TouchableOpacity className={className} onPress={handleBackToHome}>
      <Icon as={Home} size={size || 24} color={color || 'black'} />
    </TouchableOpacity>
  )
}
