import { Lock, Mail } from 'lucide-react-native'
import { Controller, SubmitHandler } from 'react-hook-form'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FieldError from '~/components/field-error'
import { useNotifications } from '~/components/providers/notifications.provider'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { isFormError } from '~/lib/utils'
import { useSignIn } from '../hooks/use-sign-in'
import { SignInSchema } from '../validations'
import GoogleAuthButton from './google-auth-button'

export default function SignInForm() {
  const { bottom } = useSafeAreaInsets()
  const {
    methods: {
      control,
      handleSubmit,
      formState: { errors }
    },
    signInMutation: { mutate: signIn, isPending: isSigningIn }
  } = useSignIn()
  const { expoPushToken } = useNotifications()

  const rootMsg = errors.root?.message || (errors as any)['']?.message || (errors as any)._errors?.[0]

  const onSubmit: SubmitHandler<SignInSchema> = (data) => {
    signIn({ ...data, notificationToken: expoPushToken ?? '' })
  }

  return (
    <View className='flex-1 flex flex-col'>
      <View className='flex flex-col gap-4'>
        <Controller
          control={control}
          name='identifier'
          render={({ field: { onChange, value, ...field } }) => (
            <Input
              {...field}
              value={value}
              onChangeText={onChange}
              placeholder='Email hoặc tên đăng nhập'
              StartIcon={<Icon as={Mail} size={20} color={PRIMARY_COLOR.LIGHT} />}
              autoFocus
              spellCheck={false}
              className={isFormError(errors, 'identifier') ? 'border-rose-500' : ''}
            />
          )}
        />
        <Controller
          control={control}
          name='password'
          render={({ field: { onChange, value, ...field } }) => (
            <Input
              {...field}
              value={value}
              onChangeText={onChange}
              placeholder='Mật khẩu'
              StartIcon={<Icon as={Lock} size={20} color={PRIMARY_COLOR.LIGHT} />}
              secureTextEntry
              spellCheck={false}
              className={isFormError(errors, 'password') ? 'border-rose-500' : ''}
            />
          )}
        />
      </View>
      <View className='flex-1' />
      <View className='flex flex-col gap-2' style={{ paddingBottom: bottom }}>
        {rootMsg && <FieldError message={rootMsg} />}
        <Button onPress={handleSubmit(onSubmit)} disabled={isSigningIn}>
          <Text className='font-inter-medium text-white'>{isSigningIn ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
        </Button>
        <GoogleAuthButton />
      </View>
    </View>
  )
}
