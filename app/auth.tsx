import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useMemo, useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import RegisterStep from '~/features/auth/components/register-step'
import SignInForm from '~/features/auth/components/sign-in-form'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { cn } from '~/lib/utils'

const STEP_DESCRIPTIONS = {
  1: {
    title: 'Thêm Email',
    description: 'Nhập email để tạo tài khoản'
  },
  2: {
    title: 'Xác Thực Email',
    description: 'Nhập mã đã được gửi đến email của bạn'
  },
  3: {
    title: 'Tạo Mật Khẩu',
    description: 'Tạo mật khẩu để bảo mật tài khoản của bạn'
  }
}

export default function AuthScreen() {
  const { isDarkColorScheme } = useColorScheme()
  const searchParams = useLocalSearchParams()
  const router = useRouter()

  const defaultTab = (searchParams.focus as string) ?? 'sign-in'
  const [currentStep, setCurrentStep] = useState(1)
  const [tabValue, setTabValue] = useState(defaultTab)

  const stepDescription = useMemo(() => STEP_DESCRIPTIONS[currentStep as keyof typeof STEP_DESCRIPTIONS], [currentStep])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  const renderHeader = () => (
    <View className='top-16 left-4 flex flex-col gap-8'>
      <TouchableOpacity onPress={handleGoBack} className='w-10 h-10 flex items-center justify-center'>
        <Feather name='arrow-left' size={24} color='white' />
      </TouchableOpacity>

      <View className='flex flex-col items-start'>
        <Text className='text-white font-inter-bold text-3xl'>
          {tabValue === 'sign-in' ? 'Bắt Đầu Ngay' : stepDescription.title}
        </Text>
        <Text className='text-white text-sm mt-2'>
          {tabValue === 'sign-in'
            ? 'Nhập thông tin đăng nhập và bắt đầu hành trình của bạn'
            : stepDescription.description}
        </Text>
      </View>
    </View>
  )

  return (
    <View className='flex-1'>
      <StatusBar style='light' />
      <Image
        source={require('~/assets/images/auth-bg.jpg')}
        className={cn('absolute inset-0 w-full h-full', isDarkColorScheme ? 'rotate-180' : '')}
        resizeMode='cover'
      />

      {renderHeader()}

      <View className='mt-24 flex-1 bg-background rounded-t-3xl p-4 pt-6'>
        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          className='w-full max-w-[400px] mx-auto flex-1 flex flex-col gap-3'
        >
          <TabsList className='flex-row w-full'>
            <TabsTrigger value='sign-in' className='flex-1'>
              <Text>Đăng Nhập</Text>
            </TabsTrigger>
            <TabsTrigger value='register' className='flex-1'>
              <Text>Đăng Ký</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='sign-in' className='flex-1 flex'>
            <SignInForm />
          </TabsContent>
          <TabsContent value='register' className='flex-1'>
            <RegisterStep currentStep={currentStep} setCurrentStep={setCurrentStep} setTabValue={setTabValue} />
          </TabsContent>
        </Tabs>
      </View>
    </View>
  )
}
