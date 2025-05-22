import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Image, View } from 'react-native'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { cn } from '~/lib/utils'

export default function AuthScreen() {
  const { isDarkColorScheme } = useColorScheme()
  const searchParams = useLocalSearchParams()

  const focus = (searchParams.focus as string) ?? 'sign-in'

  const [value, setValue] = useState(focus)

  return (
    <View className='flex-1'>
      <StatusBar style='light' />
      <Image
        source={require('~/assets/images/auth-bg.jpg')}
        className={cn('absolute inset-0 w-full h-full', isDarkColorScheme ? 'rotate-180' : '')}
        resizeMode='cover'
      />
      <View className='mt-60 flex-1 bg-background rounded-t-3xl p-4'>
        <Tabs value={value} onValueChange={setValue} className='w-full max-w-[400px] mx-auto flex-col gap-1.5'>
          <TabsList className='flex-row w-full'>
            <TabsTrigger value='sign-in' className='flex-1'>
              <Text>Sign In</Text>
            </TabsTrigger>
            <TabsTrigger value='register' className='flex-1'>
              <Text>Register</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='sign-in'></TabsContent>
          <TabsContent value='register'></TabsContent>
        </Tabs>
      </View>
    </View>
  )
}
