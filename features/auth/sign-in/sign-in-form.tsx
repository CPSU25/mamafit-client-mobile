import { Feather } from '@expo/vector-icons'
import { Controller, SubmitHandler } from 'react-hook-form'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNotifications } from '~/components/providers/notifications.provider'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { isFormError } from '~/lib/utils'
import GoogleAuthButton from '../google-oauth/google-auth-button'
import { useSignIn } from './use-sign-in'
import { SignInSchema } from './validations'

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

  const onSubmit: SubmitHandler<SignInSchema> = (data) => {
    signIn({ ...data, notificationToken: expoPushToken ?? '' })
  }

  return (
    <View className='flex-1 flex flex-col mt-6'>
      <View className='flex flex-col gap-4'>
        <Controller
          control={control}
          name='identifier'
          render={({ field: { onChange, value, ...field } }) => (
            <Input
              {...field}
              value={value}
              onChangeText={onChange}
              placeholder='Username or email'
              StartIcon={<Feather name='mail' size={20} color={PRIMARY_COLOR.LIGHT} />}
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
              placeholder='Password'
              StartIcon={<Feather name='lock' size={20} color={PRIMARY_COLOR.LIGHT} />}
              secureTextEntry
              spellCheck={false}
              className={isFormError(errors, 'password') ? 'border-rose-500' : ''}
            />
          )}
        />
      </View>
      <Text className='text-right text-sm text-primary font-inter-semibold mt-2.5'>Forgot password?</Text>
      <View className='flex-1' />
      <View className='flex flex-col gap-2' style={{ paddingBottom: bottom }}>
        <Button onPress={handleSubmit(onSubmit)} disabled={isSigningIn}>
          <Text className='font-inter-medium text-white'>{isSigningIn ? 'Signing in...' : "Let's Go!"}</Text>
        </Button>
        <GoogleAuthButton />
      </View>
    </View>
  )
}
