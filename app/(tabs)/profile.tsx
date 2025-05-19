import Wrapper from '~/components/wrapper'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'

export default function ProfileScreen() {
  const router = useRouter()
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
        <View className='flex flex-row items-center justify-between'>
          <Avatar alt="Zach Nugent's Avatar" className='size-12'>
            <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
            <AvatarFallback>
              <Text>ZN</Text>
            </AvatarFallback>
          </Avatar>
          <View className='flex flex-row items-center gap-2'>
            <Button className='w-32' variant='outline' onPress={() => router.push('/(auth)/sign-in')} size='sm'>
              <Text className='font-roboto'>Đăng nhập</Text>
            </Button>
            <Button className='w-32' variant='default' onPress={() => router.push('/(auth)/sign-up')} size='sm'>
              <Text className='font-roboto'>Đăng ký</Text>
            </Button>
          </View>
        </View>
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
