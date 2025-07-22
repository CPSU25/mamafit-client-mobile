import { FlatList, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { OptionMap } from '../../types'
import GeneralAddOnOptionCard from './general-add-on-option-card'

interface OptionsListProps {
  onPress: (option: OptionMap | null) => void
  options: OptionMap[]
}

export default function OptionsList({ onPress, options }: OptionsListProps) {
  return (
    <View className='flex-1'>
      <FlatList
        data={options}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(100 + index * 80)}>
            <GeneralAddOnOptionCard option={item} onPress={() => onPress(item)} />
          </Animated.View>
        )}
        contentContainerClassName='gap-4 p-4'
      />
    </View>
  )
}
