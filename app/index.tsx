import { View } from 'react-native'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Button>
        <Text>MamaFit</Text>
      </Button>
    </View>
  )
}
