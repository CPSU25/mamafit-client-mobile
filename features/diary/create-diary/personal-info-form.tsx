import { Feather, MaterialIcons } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import FieldError from '~/components/field-error'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useFieldError } from '~/hooks/use-field-error'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, isFormError } from '~/lib/utils'
import { PersonalInfoFormInput } from './validations'

export default function PersonalInfoForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<PersonalInfoFormInput>()
  const className = useFieldError()

  return (
    <View className='flex flex-col gap-4'>
      <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
        <Text className='font-inter-semibold'>Basic Information</Text>
        <Text className='text-muted-foreground text-xs'>
          Please provide your basic information to help us personalize your experience.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} className='flex flex-col gap-2'>
        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, value, ...field } }) => (
            <Input
              placeholder='Diary name'
              keyboardType='default'
              StartIcon={<Feather name='book' size={20} color={PRIMARY_COLOR.LIGHT} />}
              {...field}
              value={value}
              onChangeText={onChange}
              className={cn('bg-background border-input', isFormError(errors, 'name') ? className : '')}
            />
          )}
        />
        {isFormError(errors, 'name') && <FieldError message={errors.name?.message || ''} />}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} className='flex flex-col gap-1'>
        <Text className='font-inter-semibold'>Physical Measurements</Text>
        <Text className='text-muted-foreground text-xs'>
          Your measurements help us provide accurate recommendations.
        </Text>

        <View className='flex flex-col gap-2 mt-4'>
          <Controller
            control={control}
            name='weight'
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                placeholder='Weight (kg)'
                keyboardType='numeric'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                {...field}
                value={value}
                onChangeText={onChange}
                className={cn('bg-background border-input', isFormError(errors, 'weight') ? className : '')}
                EndIcon={<Text className='text-muted-foreground text-sm'>kg</Text>}
              />
            )}
          />
          {isFormError(errors, 'weight') && <FieldError message={errors.weight?.message || ''} />}

          <Controller
            control={control}
            name='height'
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                placeholder='Height (cm)'
                keyboardType='numeric'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                {...field}
                value={value}
                onChangeText={onChange}
                className={cn('bg-background border-input', isFormError(errors, 'height') ? className : '')}
                EndIcon={<Text className='text-muted-foreground text-sm'>cm</Text>}
              />
            )}
          />
          {isFormError(errors, 'height') && <FieldError message={errors.height?.message || ''} />}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} className='flex flex-col gap-1'>
        <Text className='font-inter-semibold'>Personal Details</Text>
        <Text className='text-muted-foreground text-xs'>Your age helps us calculate important health metrics.</Text>

        <View className='flex flex-col gap-2 mt-4'>
          <Controller
            control={control}
            name='age'
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                placeholder='Age'
                keyboardType='numeric'
                StartIcon={<MaterialIcons name='numbers' size={20} color={PRIMARY_COLOR.LIGHT} />}
                {...field}
                value={value}
                onChangeText={onChange}
                className={cn('bg-background border-input', isFormError(errors, 'age') ? className : '')}
                EndIcon={<Text className='text-muted-foreground text-sm'>years</Text>}
              />
            )}
          />
          {isFormError(errors, 'age') && <FieldError message={errors.age?.message || ''} />}
        </View>
      </Animated.View>
    </View>
  )
}
