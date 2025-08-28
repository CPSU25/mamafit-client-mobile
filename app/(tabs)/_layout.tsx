import { Tabs, useSegments } from 'expo-router'
import { Bell, BookHeart, House, UserRound } from 'lucide-react-native'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { THEME } from '~/lib/constants/theme'
import { cn } from '~/lib/utils'

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: React.ReactNode; title: string }) => {
  return (
    <View className='flex-1 mt-1.5 flex flex-col items-center'>
      {icon}
      <Text
        className={cn(
          'text-[9px] w-full text-center mt-1 font-inter-medium',
          focused ? 'text-primary' : 'text-muted-foreground'
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
    title: 'Trang chủ',
    icon: (focused: boolean) => (
      <Icon as={House} size={21} color={focused ? THEME.light.primary : THEME.light.mutedForeground} />
    )
  },
  {
    id: 2,
    name: 'diary',
    title: 'Nhật ký',
    icon: (focused: boolean) => (
      <Icon as={BookHeart} size={21} color={focused ? THEME.light.primary : THEME.light.mutedForeground} />
    )
  },
  {
    id: 3,
    name: 'notifications',
    title: 'Thông báo',
    icon: (focused: boolean) => (
      <Icon as={Bell} size={21} color={focused ? THEME.light.primary : THEME.light.mutedForeground} />
    )
  },
  {
    id: 4,
    name: 'profile',
    title: 'Tài khoản',
    icon: (focused: boolean) => (
      <Icon as={UserRound} size={21} color={focused ? THEME.light.primary : THEME.light.mutedForeground} />
    )
  }
]

const isHiddenTabBar = (segments: string[], route: string) => {
  const routes = route.split('/').filter((r) => r)
  return routes.every((r) => segments.includes(r))
}

export default function TabsLayout() {
  const segments = useSegments()
  const { bottom } = useSafeAreaInsets()
  const { isDarkColorScheme } = useColorScheme()

  const isCreateDiary = isHiddenTabBar(segments, '/diary/create')
  const isAppointment = isHiddenTabBar(segments, '/profile/appointment')
  const isDiaryDetail = isHiddenTabBar(segments, '/diary/detail')
  const isDiaryHistory = isHiddenTabBar(segments, '/diary/history')
  const isDiarySetting = isHiddenTabBar(segments, '/diary/setting')
  const isNotificationsByType = isHiddenTabBar(segments, '/notifications/[notificationType]')

  const isHidden =
    isCreateDiary || isAppointment || isDiaryDetail || isDiaryHistory || isDiarySetting || isNotificationsByType

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
          height: bottom + 50,
          display: isHidden ? 'none' : 'flex'
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
