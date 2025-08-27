import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ChevronRight } from 'lucide-react-native'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { Branch } from '~/types/order.type'

interface PreviewBranchCardProps {
  branch: Branch
  onPress: () => void
}

export default function PreviewBranchCard({ branch, onPress }: PreviewBranchCardProps) {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <TouchableOpacity onPress={onPress}>
      <Card className='p-3 flex flex-row items-start gap-2' style={[styles.container]}>
        <MaterialCommunityIcons name='storefront' size={18} color={PRIMARY_COLOR.LIGHT} />
        <View className='flex-1 gap-0.5'>
          <Text className='text-sm font-inter-medium' numberOfLines={1}>
            {branch.name}
          </Text>

          <Text numberOfLines={2} className={`text-xs ${isDarkColorScheme ? 'text-white/70' : 'text-black/70'}`}>
            {branch?.street}, {branch?.ward}, {branch?.district}, {branch?.province}
          </Text>
        </View>
        <Icon as={ChevronRight} size={20} color='lightgray' className='self-center' />
      </Card>
    </TouchableOpacity>
  )
}
