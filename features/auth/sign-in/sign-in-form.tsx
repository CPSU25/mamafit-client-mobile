import { Feather } from '@expo/vector-icons'
import { Controller, SubmitHandler } from 'react-hook-form'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants'
import GoogleAuthButton from '../google-auth-button'
import { useSignIn } from './use-sign-in'
import { SignInSchema } from './validations'

export default function SignInForm() {
  const { bottom } = useSafeAreaInsets()
  const {
    methods: { control, handleSubmit }
  } = useSignIn()

  const onSubmit: SubmitHandler<SignInSchema> = (data) => {
    console.log(data)
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
            />
          )}
        />
      </View>
      <Text className='text-right text-sm text-primary font-inter-semibold mt-2.5'>Forgot password?</Text>
      <View className='flex-1' />
      <View className='flex flex-col gap-2' style={{ paddingBottom: bottom }}>
        <Button onPress={handleSubmit(onSubmit)}>
          <Text className='font-inter-medium '>Let&apos;s Go!</Text>
        </Button>
        <GoogleAuthButton />
      </View>
    </View>
  )
}
