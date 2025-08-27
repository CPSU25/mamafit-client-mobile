import { Tabs, useSegments } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: React.ReactNode; title: string }) => {
  return (
    <View className='flex-1 mt-2 flex flex-col items-center'>
      {icon}
      <Text
        className={cn(
          'text-xs w-full text-center mt-0.5 font-inter-medium',
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
    icon: (focused: boolean) => SvgIcon.home({ size: 26, color: focused ? 'PRIMARY' : 'GRAY' })
  },
  {
    id: 2,
    name: 'diary',
    title: 'Nhật ký',
    icon: (focused: boolean) => SvgIcon.diary({ size: 26, color: focused ? 'PRIMARY' : 'GRAY' })
  },
  {
    id: 3,
    name: 'notifications',
    title: 'Thông báo',
    icon: (focused: boolean) => SvgIcon.notification({ size: 26, color: focused ? 'PRIMARY' : 'GRAY' })
  },
  {
    id: 4,
    name: 'profile',
    title: 'Tôi',
    icon: (focused: boolean) => SvgIcon.user({ size: 26, color: focused ? 'PRIMARY' : 'GRAY' })
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

  const isHidden = isCreateDiary || isAppointment || isDiaryDetail || isDiaryHistory || isDiarySetting

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
          height: bottom + 60,
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
