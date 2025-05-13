import Wrapper from '~/components/wrapper'
import { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'

export default function ProfileScreen() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme()
  const [checked, setChecked] = useState(isDarkColorScheme ? true : false)

  const toggleColorScheme = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark'
    setColorScheme(newTheme)
    setChecked((prev) => !prev)
  }

  return (
    <SafeAreaView>
      <Wrapper>
        <Text className='font-roboto-semibold text-2xl'>ProfileScreen</Text>
        <View className='flex-row items-center justify-between'>
          <Label nativeID='dark-mode' onPress={toggleColorScheme} className='font-roboto'>
            Chế độ tối
          </Label>
          <Switch checked={checked} onCheckedChange={toggleColorScheme} nativeID='dark-mode' />
        </View>
      </Wrapper>
    </SafeAreaView>
  )
}
