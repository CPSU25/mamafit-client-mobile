import * as React from 'react'
import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants'
import { useAuth } from '~/hooks/use-auth'
import Loading from '~/components/loading'

export default function ChatScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  const handleGoBack = () => {
    router.back()
  }

  const chats = [1, 2, 3, 4, 5]

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Chats</Text>
      </View>
      <View className='bg-muted h-2' />
      <FlatList
        data={chats}
        renderItem={({ item, index }) => (
          <>
            <TouchableOpacity className='flex flex-row gap-4 items-center flex-1'>
              <Avatar alt="Zach Nugent's Avatar" className='size-14'>
                <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
                <AvatarFallback>
                  <Text>ZN</Text>
                </AvatarFallback>
              </Avatar>
              <View className='flex flex-col flex-1'>
                <Text className='font-inter-medium'>John Doe</Text>
                <Text className='text-sm text-muted-foreground' numberOfLines={1}>
                  Hello, how are you?
                </Text>
              </View>
              <Text className='self-start text-xs text-muted-foreground'>12:07</Text>
            </TouchableOpacity>
            {index !== chats.length - 1 && <Separator className='mt-4' />}
          </>
        )}
        contentContainerClassName='gap-4 p-4'
      />
    </SafeAreaView>
  )
}
