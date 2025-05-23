import Feather from '@expo/vector-icons/Feather'
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { PRIMARY_COLOR } from '~/lib/constants'
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
    name: 'calendar',
    title: 'Calendar',
    icon: (focused: boolean) => <Feather name='calendar' size={22} color={focused ? PRIMARY_COLOR.LIGHT : 'gray'} />
  },
  {
    id: 3,
    name: 'canvases',
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

export default function TabsLayout() {
  const { isDarkColorScheme } = useColorScheme()

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
          minHeight: 70
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
