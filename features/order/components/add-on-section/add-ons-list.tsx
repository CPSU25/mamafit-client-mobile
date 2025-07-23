import { FlatList, TouchableOpacity } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { styles } from '~/lib/constants/constants'
import { AddOnMap } from '../../types'
import { getAddOnImage } from '../../utils'
import AddOnCard from './add-on-card'

interface AddOnsListProps {
  addOns: AddOnMap[]
  onPress: (addOn: AddOnMap) => void
  refreshControl: React.JSX.Element
}

export default function AddOnsList({ addOns, onPress, refreshControl }: AddOnsListProps) {
  return (
    <FlatList
      data={addOns}
      keyExtractor={(flattenedAddOn) => flattenedAddOn.id}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => onPress(item)}>
          <Animated.View
            className='bg-card rounded-2xl'
            style={styles.container}
            entering={FadeInDown.delay(100 + index * 80)}
          >
            <AddOnCard addOn={item} getAddOnImage={getAddOnImage} />
          </Animated.View>
        </TouchableOpacity>
      )}
      contentContainerClassName='p-4 gap-2'
      refreshControl={refreshControl}
    />
  )
}
