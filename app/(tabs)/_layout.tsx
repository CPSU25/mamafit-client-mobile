import Feather from '@expo/vector-icons/Feather'
import { Tabs, useSegments } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: React.ReactNode; title: string }) => {
  return (
    <View className='flex-1 mt-2 flex flex-col items-center'>
      {icon}
      <Text
        className={cn(
          'text-xs w-full text-center mt-1 font-inter',
          focused ? 'text-primary font-inter-medium' : 'text-muted-foreground'
        )}
      >
        {title}
      </Text>
    </View>
  )
}

const navigationOptions = [
  {
    id: 1,
    name: 'index',
    title: 'Home',
    icon: (focused: boolean) => <Feather name='home' size={22} color={focused ? PRIMARY_COLOR.LIGHT : 'gray'} />
  },
  {
    id: 2,
    name: 'diary',
    title: 'Diary',
    icon: (focused: boolean) => <Feather name='book-open' size={22} color={focused ? PRIMARY_COLOR.LIGHT : 'gray'} />
  },
  {
    id: 3,
    name: 'canvas',
    title: 'Canvas',
    icon: (focused: boolean) => <Feather name='layout' size={22} color={focused ? PRIMARY_COLOR.LIGHT : 'gray'} />
  },
  {
    id: 4,
    name: 'notifications',
    title: 'Notifications',
    icon: (focused: boolean) => <Feather name='bell' size={22} color={focused ? PRIMARY_COLOR.LIGHT : 'gray'} />
  },
  {
    id: 5,
    name: 'profile',
    title: 'Profile',
    icon: (focused: boolean) => <Feather name='user' size={22} color={focused ? PRIMARY_COLOR.LIGHT : 'gray'} />
  }
]

const isDisplayTabBar = (segments: string[], route: string) => {
  const routes = route.split('/').filter((r) => r)
  return routes.every((r) => segments.includes(r))
}

export default function TabsLayout() {
  const segments = useSegments()
  const { bottom } = useSafeAreaInsets()
  const { isDarkColorScheme } = useColorScheme()

  const isCreateDiary = isDisplayTabBar(segments, '/diary/create')
  const isAppointment = isDisplayTabBar(segments, '/profile/appointment')
  const isDiaryDetail = isDisplayTabBar(segments, '/diary/detail')
  const isDiaryHistory = isDisplayTabBar(segments, '/diary/history')
  const isDiarySetting = isDisplayTabBar(segments, '/diary/setting')
  const isCreateCanvas = isDisplayTabBar(segments, '/canvas/create')

  const isDisplay =
    isCreateDiary || isAppointment || isDiaryDetail || isDiaryHistory || isDiarySetting || isCreateCanvas

  return (
    <Tabs
      initialRouteName='index'
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarShowLabel: false,
        headerPressColor: 'transparent',
        tabBarStyle: {
          backgroundColor: isDarkColorScheme ? 'black' : 'white',
          position: 'absolute',
          borderTopWidth: 1,
          height: bottom + 55,
          display: isDisplay ? 'none' : 'flex'
        }
      }}
    >
      {navigationOptions.map((option) => (
        <Tabs.Screen
          key={option.id}
          name={option.name}
          options={{
            title: option.title,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={option.icon(focused)} title={option.title} />
          }}
        />
      ))}
    </Tabs>
  )
}
