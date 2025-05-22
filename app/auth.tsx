import RegisterStep from '~/features/auth/register/register-step'
import SignInForm from '~/features/auth/sign-in/sign-in-form'
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
      <View className='top-16 left-4 flex flex-col gap-10'>
        <View className='flex flex-row items-center gap-2'>
          <Image
            source={require('~/assets/images/mamafit-app-icon.png')}
            className='size-10 rounded-xl border-white border-2'
          />
          <Text className='text-white text-lg font-inter-semibold'>Mama Fit</Text>
        </View>
        <View className='flex flex-col items-start'>
          <Text className='text-white font-inter-bold text-4xl'>Get Started now</Text>
          <Text className='text-white text-sm mt-2'>Create an account or sign in to explore more about our app</Text>
        </View>
      </View>
      <View className='mt-24 flex-1 bg-background rounded-t-3xl p-4'>
        <Tabs
          value={value}
          onValueChange={setValue}
          className='w-full max-w-[400px] mx-auto flex-1 flex flex-col gap-1.5'
        >
          <TabsList className='flex-row w-full'>
            <TabsTrigger value='sign-in' className='flex-1'>
              <Text>Sign In</Text>
            </TabsTrigger>
            <TabsTrigger value='register' className='flex-1'>
              <Text>Register</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='sign-in' className='flex-1 flex'>
            <SignInForm />
          </TabsContent>
          <TabsContent value='register' className='flex-1'>
            <RegisterStep />
          </TabsContent>
        </Tabs>
      </View>
    </View>
  )
}
