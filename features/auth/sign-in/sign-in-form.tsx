import Svg, { Path } from 'react-native-svg'
import { Feather } from '@expo/vector-icons'
import { Controller, SubmitHandler } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants'
import { useSignIn } from './use-sign-in'
import { SignInSchema } from './validations'

export default function SignInForm() {
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
      <View className='flex flex-col gap-2 mb-6'>
        <Button onPress={handleSubmit(onSubmit)}>
          <Text className='font-inter-medium '>Let&apos;s Go!</Text>
        </Button>
        <Button variant='outline' className='flex flex-row items-start justify-center gap-2'>
          <Svg width={22} height={22} viewBox='0 0 48 48'>
            <Path
              fill='#FFC107'
              d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
            />
            <Path
              fill='#FF3D00'
              d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
            />
            <Path
              fill='#4CAF50'
              d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
            />
            <Path
              fill='#1976D2'
              d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
            />
          </Svg>
          <Text className='font-inter-medium'>Continue with Google</Text>
        </Button>
      </View>
    </View>
  )
}
