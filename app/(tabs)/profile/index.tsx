import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { G, Path } from 'react-native-svg'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import { Text } from '~/components/ui/text'
import CurrentUser from '~/features/auth/current-user/current-user'
import { useAuth } from '~/hooks/use-auth'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants'

interface OrderStatus {
  id: number
  name: string
  icon: React.ReactNode
}

const statuses: OrderStatus[] = [
  {
    id: 1,
    name: 'To Pay',
    icon: (
      <Svg width={ICON_SIZE.MEDIUM} height={ICON_SIZE.MEDIUM} viewBox='0 0 24 24' fill='none'>
        <G id='SVGRepo_bgCarrier' stroke-width='0'></G>
        <G id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></G>
        <G id='SVGRepo_iconCarrier'>
          <Path
            opacity='0.4'
            d='M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z'
            fill='#6d28d9'
          ></Path>
          <Path
            d='M14.85 3.95012V7.75011H6.26C4.19 7.75011 2.5 9.44012 2.5 11.5101V7.84014C2.5 6.65014 3.23 5.59009 4.34 5.17009L12.28 2.17009C13.52 1.71009 14.85 2.62012 14.85 3.95012Z'
            fill='#6d28d9'
          ></Path>
          <Path
            d='M22.5608 13.9702V16.0302C22.5608 16.5802 22.1208 17.0302 21.5608 17.0502H19.6008C18.5208 17.0502 17.5308 16.2602 17.4408 15.1802C17.3808 14.5502 17.6208 13.9602 18.0408 13.5502C18.4108 13.1702 18.9208 12.9502 19.4808 12.9502H21.5608C22.1208 12.9702 22.5608 13.4202 22.5608 13.9702Z'
            fill='#6d28d9'
          ></Path>
          <Path
            d='M14 12.75H7C6.59 12.75 6.25 12.41 6.25 12C6.25 11.59 6.59 11.25 7 11.25H14C14.41 11.25 14.75 11.59 14.75 12C14.75 12.41 14.41 12.75 14 12.75Z'
            fill='#6d28d9'
          ></Path>
        </G>
      </Svg>
    )
  },
  {
    id: 2,
    name: 'To Ship',
    icon: (
      <Svg width={ICON_SIZE.MEDIUM} height={ICON_SIZE.MEDIUM} viewBox='0 0 24 24' fill='none'>
        <G id='SVGRepo_bgCarrier' stroke-width='0'></G>
        <G id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></G>
        <G id='SVGRepo_iconCarrier'>
          <Path
            opacity='0.4'
            d='M19.3504 5.65995L13.0604 2.27C12.4004 1.91 11.6004 1.91 10.9304 2.27L4.64041 5.65995C4.18041 5.90995 3.90039 6.39998 3.90039 6.93998C3.90039 7.47998 4.18041 7.96995 4.64041 8.21995L10.9304 11.61C11.2604 11.79 11.6304 11.88 11.9904 11.88C12.3604 11.88 12.7204 11.79 13.0504 11.61L19.3404 8.21995C19.8004 7.96995 20.0804 7.47998 20.0804 6.93998C20.0904 6.39998 19.8104 5.90995 19.3504 5.65995Z'
            fill='#6d28d9'
          ></Path>
          <Path
            opacity='0.4'
            d='M9.9007 12.7899L4.05069 9.85989C3.60069 9.62989 3.0807 9.65989 2.6507 9.91989C2.2207 10.1799 1.9707 10.6399 1.9707 11.1399V16.6699C1.9707 17.6299 2.50069 18.4899 3.36069 18.9199L9.21069 21.8399C9.41069 21.9399 9.63071 21.9899 9.85071 21.9899C10.1107 21.9899 10.3707 21.9199 10.6007 21.7699C11.0307 21.5099 11.2807 21.0499 11.2807 20.5499V15.0199C11.2907 14.0799 10.7607 13.2199 9.9007 12.7899Z'
            fill='#6d28d9'
          ></Path>
          <Path
            opacity='0.4'
            d='M22.0309 11.1502V15.7401C22.0209 15.7301 22.0109 15.7101 22.0009 15.7001C22.0009 15.6901 21.991 15.6801 21.981 15.6701C21.941 15.6101 21.8909 15.5501 21.8409 15.5001C21.8309 15.4901 21.8209 15.4702 21.8109 15.4602C21.0009 14.5602 19.8109 14.0001 18.5009 14.0001C17.2409 14.0001 16.0909 14.5201 15.2709 15.3601C14.4809 16.1701 14.0009 17.2801 14.0009 18.5001C14.0009 19.3401 14.2409 20.1401 14.6509 20.8201C14.8209 21.1101 15.031 21.3701 15.261 21.6101L14.791 21.8501C14.591 21.9501 14.3709 22.0001 14.1509 22.0001C13.8909 22.0001 13.631 21.9302 13.391 21.7802C12.971 21.5202 12.7109 21.0601 12.7109 20.5601V15.0401C12.7109 14.0801 13.241 13.2201 14.101 12.7901L19.951 9.87013C20.401 9.64013 20.921 9.66012 21.351 9.93012C21.771 10.1901 22.0309 10.6502 22.0309 11.1502Z'
            fill='#6d28d9'
          ></Path>
          <Path
            d='M21.98 15.65C21.16 14.64 19.91 14 18.5 14C17.44 14 16.46 14.37 15.69 14.99C14.65 15.81 14 17.08 14 18.5C14 19.91 14.64 21.16 15.65 21.98C16.42 22.62 17.42 23 18.5 23C19.64 23 20.67 22.57 21.47 21.88C22.4 21.05 23 19.85 23 18.5C23 17.42 22.62 16.42 21.98 15.65ZM19.53 18.78C19.53 19.04 19.39 19.29 19.17 19.42L17.76 20.26C17.64 20.33 17.51 20.37 17.37 20.37C17.12 20.37 16.87 20.24 16.73 20.01C16.52 19.65 16.63 19.19 16.99 18.98L18.03 18.36V17.1C18.03 16.69 18.37 16.35 18.78 16.35C19.19 16.35 19.53 16.69 19.53 17.1V18.78Z'
            fill='#6d28d9'
          ></Path>
        </G>
      </Svg>
    )
  },
  {
    id: 3,
    name: 'To Receive',
    icon: (
      <Svg width={ICON_SIZE.MEDIUM} height={ICON_SIZE.MEDIUM} viewBox='0 0 24 24' fill='none'>
        <G id='SVGRepo_bgCarrier' stroke-width='0'></G>
        <G id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></G>
        <G id='SVGRepo_iconCarrier'>
          <Path
            d='M5 1C4.06 1 3.19 1.33 2.5 1.88C1.58 2.61 1 3.74 1 5C1 7.21 2.79 9 5 9C6.01 9 6.93001 8.62 7.64001 8C8.47001 7.27 9 6.2 9 5C9 2.79 7.21 1 5 1ZM6 5.25C6 5.51 5.86001 5.76001 5.64001 5.89001L4.39001 6.64001C4.27001 6.71001 4.14001 6.75 4.01001 6.75C3.76001 6.75 3.51 6.62001 3.37 6.39001C3.16 6.03001 3.27 5.56999 3.63 5.35999L4.52002 4.83002V3.75C4.52002 3.34 4.86002 3 5.27002 3C5.68002 3 6.02002 3.34 6.02002 3.75V5.25H6Z'
            fill='#6d28d9'
          ></Path>
          <Path
            opacity='0.4'
            d='M15 3V12C15 13.1 14.1 14 13 14H2V7.62C2.73 8.49 3.85003 9.03 5.09003 9C6.10003 8.98 7.01 8.59 7.69 7.94C8 7.68 8.26002 7.34999 8.46002 6.98999C8.82002 6.37999 9.02 5.65997 9 4.90997C8.97 3.73997 8.45001 2.71 7.64001 2H14C14.55 2 15 2.45 15 3Z'
            fill='#6d28d9'
          ></Path>
          <Path
            d='M22 14V17C22 18.66 20.66 20 19 20H18C18 18.9 17.1 18 16 18C14.9 18 14 18.9 14 20H10C10 18.9 9.1 18 8 18C6.9 18 6 18.9 6 20H5C3.34 20 2 18.66 2 17V14H13C14.1 14 15 13.1 15 12V5H16.84C17.56 5 18.22 5.39001 18.58 6.01001L20.29 9H19C18.45 9 18 9.45 18 10V13C18 13.55 18.45 14 19 14H22Z'
            fill='#6d28d9'
          ></Path>
          <Path
            opacity='0.4'
            d='M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z'
            fill='#6d28d9'
          ></Path>
          <Path
            opacity='0.4'
            d='M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z'
            fill='#6d28d9'
          ></Path>
          <Path
            opacity='0.4'
            d='M22 12.53V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L21.74 11.54C21.91 11.84 22 12.18 22 12.53Z'
            fill='#6d28d9'
          ></Path>
        </G>
      </Svg>
    )
  },
  {
    id: 4,
    name: 'To Rate',
    icon: (
      <Svg width={ICON_SIZE.MEDIUM} height={ICON_SIZE.MEDIUM} viewBox='0 0 24 24' fill='none'>
        <G id='SVGRepo_bgCarrier' stroke-width='0'></G>
        <G id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></G>
        <G id='SVGRepo_iconCarrier'>
          <Path
            opacity='0.4'
            d='M5.73937 16C5.84937 15.51 5.64937 14.81 5.29937 14.46L2.86937 12.03C2.10937 11.27 1.80937 10.46 2.02937 9.76C2.25937 9.06 2.96937 8.58 4.02937 8.4L7.14937 7.88C7.59937 7.8 8.14937 7.4 8.35937 6.99L10.0794 3.54C10.5794 2.55 11.2594 2 11.9994 2C12.7394 2 13.4194 2.55 13.9194 3.54L15.6394 6.99C15.7694 7.25 16.0394 7.5 16.3294 7.67L5.55937 18.44C5.41937 18.58 5.17937 18.45 5.21937 18.25L5.73937 16Z'
            fill='#6d28d9'
          ></Path>
          <Path
            d='M18.7008 14.4599C18.3408 14.8199 18.1408 15.5099 18.2608 15.9999L18.9508 19.0099C19.2408 20.2599 19.0608 21.1999 18.4408 21.6499C18.1908 21.8299 17.8908 21.9199 17.5408 21.9199C17.0308 21.9199 16.4308 21.7299 15.7708 21.3399L12.8408 19.5999C12.3808 19.3299 11.6208 19.3299 11.1608 19.5999L8.23078 21.3399C7.12078 21.9899 6.17078 22.0999 5.56078 21.6499C5.33078 21.4799 5.16078 21.2499 5.05078 20.9499L17.2108 8.7899C17.6708 8.3299 18.3208 8.1199 18.9508 8.2299L19.9608 8.3999C21.0208 8.5799 21.7308 9.0599 21.9608 9.7599C22.1808 10.4599 21.8808 11.2699 21.1208 12.0299L18.7008 14.4599Z'
            fill='#6d28d9'
          ></Path>
        </G>
      </Svg>
    )
  }
]

function OrderStage({ status }: { status: OrderStatus }) {
  return (
    <View className='flex flex-col gap-2 items-center'>
      {status.icon}
      <Text className='text-xs'>{status.name}</Text>
    </View>
  )
}

export default function ProfileScreen() {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { isDarkColorScheme, setColorScheme } = useColorScheme()
  const [checked, setChecked] = useState(isDarkColorScheme ? true : false)
  const toggleColorScheme = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark'
    setColorScheme(newTheme)
    setChecked((prev) => !prev)
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex flex-row items-center justify-between p-4'>
        <CurrentUser />
        {isAuthenticated && !isLoading ? (
          <View className='flex flex-row items-center gap-6 mr-2'>
            <TouchableOpacity onPress={() => router.push('/setting')}>
              <Feather name='settings' size={24} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/cart')}>
              <Feather name='shopping-bag' size={24} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/chat')}>
              <Feather name='message-circle' size={24} color={PRIMARY_COLOR.LIGHT} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className='flex flex-row items-center gap-2'>
            <Button className='w-32' variant='outline' onPress={() => router.push('/auth?focus=sign-in')} size='sm'>
              <Text className='font-inter-medium'>Sign In</Text>
            </Button>
            <Button className='w-32' variant='default' onPress={() => router.push('/auth?focus=register')} size='sm'>
              <Text className='font-inter-medium'>Register</Text>
            </Button>
          </View>
        )}
      </View>
      <View className='bg-muted h-2' />
      <View className='flex flex-row items-baseline justify-between p-4 mb-2'>
        <Text className='font-inter-medium'>My Purchases</Text>
        <TouchableOpacity className='flex flex-row items-start'>
          <Text className='text-xs text-muted-foreground mr-0.5'>View Purchase History</Text>
          <Feather name='chevron-right' size={18} color='lightgray' />
        </TouchableOpacity>
      </View>
      <View className='flex flex-row items-center justify-around mb-6'>
        {statuses.map((status) => (
          <TouchableOpacity key={status.id}>
            <OrderStage status={status} />
          </TouchableOpacity>
        ))}
      </View>

      <View className='bg-muted h-2' />

      <TouchableOpacity className='flex-row items-center p-4' onPress={() => router.push('/profile/appointment')}>
        <Feather name='calendar' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5'>My Appointments</Text>
        <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity className='flex-row items-center p-4'>
        <Feather name='percent' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5'>My Vouchers</Text>
        <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>
      <Separator />
      <Pressable className='flex-row items-center p-4' onPress={toggleColorScheme}>
        <Feather name='moon' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5 flex-1'>Dark Mode</Text>
        <Switch checked={checked} onCheckedChange={toggleColorScheme} />
      </Pressable>
    </SafeAreaView>
  )
}
