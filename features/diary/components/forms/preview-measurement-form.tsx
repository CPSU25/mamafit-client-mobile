import { Feather, FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from 'react-native-reanimated'
import FieldError from '~/components/field-error'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useFieldError } from '~/hooks/use-field-error'
import { KEYBOARD_OFFSET, PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, isFormError } from '~/lib/utils'
import { PreviewMeasurementFormInput } from '../../validations'
import { TipCard } from '~/components/ui/alert-card'

export default function PreviewMeasurementForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<PreviewMeasurementFormInput>()
  const { isDarkColorScheme } = useColorScheme()

  const className = useFieldError()

  return (
    <KeyboardAwareScrollView bottomOffset={KEYBOARD_OFFSET} showsVerticalScrollIndicator={false}>
      <View className='flex flex-col gap-4'>
        {/* Weight Section */}
        <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-2'>
          <View>
            <Text className='font-inter-medium text-sm'>Weight</Text>
            <Text className='text-muted-foreground text-xs'>Track your weight changes throughout pregnancy</Text>
          </View>
          <Controller
            control={control}
            name='weight'
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                placeholder='Enter your current weight'
                keyboardType='numeric'
                StartIcon={<Feather name='activity' size={20} color={PRIMARY_COLOR.LIGHT} />}
                {...field}
                value={value}
                onChangeText={onChange}
                className={cn('bg-background border-input', isFormError(errors, 'weight') ? className : '')}
                EndIcon={<Text className='text-muted-foreground text-sm font-medium'>kg</Text>}
              />
            )}
          />
          {isFormError(errors, 'weight') && <FieldError message={errors.weight?.message || ''} />}
        </Animated.View>

        {/* Body Measurements Section */}
        <Animated.View entering={FadeInDown.delay(200)} className='flex flex-col gap-2'>
          <View>
            <Text className='font-inter-medium text-sm'>Body Circumferences</Text>
            <Text className='text-muted-foreground text-xs'>Monitor changes in your body shape during pregnancy</Text>
          </View>

          <View className='flex flex-col gap-2'>
            {/* Bust */}
            <View className='flex flex-col gap-2'>
              <Controller
                control={control}
                name='bust'
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    placeholder='Bust circumference'
                    keyboardType='numeric'
                    StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                    {...field}
                    value={value}
                    onChangeText={onChange}
                    className={cn('bg-background border-input', isFormError(errors, 'bust') ? className : '')}
                    EndIcon={<Text className='text-muted-foreground text-sm font-medium'>cm</Text>}
                  />
                )}
              />
              {isFormError(errors, 'bust') && <FieldError message={errors.bust?.message || ''} />}
            </View>

            {/* Waist */}
            <View className='flex flex-col gap-2'>
              <Controller
                control={control}
                name='waist'
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    placeholder='Waist circumference'
                    keyboardType='numeric'
                    StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                    {...field}
                    value={value}
                    onChangeText={onChange}
                    className={cn('bg-background border-input', isFormError(errors, 'waist') ? className : '')}
                    EndIcon={<Text className='text-muted-foreground text-sm font-medium'>cm</Text>}
                  />
                )}
              />
              {isFormError(errors, 'waist') && <FieldError message={errors.waist?.message || ''} />}
            </View>

            {/* Hip */}
            <View className='flex flex-col gap-2'>
              <Controller
                control={control}
                name='hip'
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    placeholder='Hip circumference'
                    keyboardType='numeric'
                    StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                    {...field}
                    value={value}
                    onChangeText={onChange}
                    className={cn('bg-background border-input', isFormError(errors, 'hip') ? className : '')}
                    EndIcon={<Text className='text-muted-foreground text-sm font-medium'>cm</Text>}
                  />
                )}
              />
              {isFormError(errors, 'hip') && <FieldError message={errors.hip?.message || ''} />}
            </View>
          </View>
        </Animated.View>

        <TipCard title='Tips' delay={300}>
          <View className='flex flex-col gap-1'>
            <Text className={cn('text-xs', isDarkColorScheme ? 'text-emerald-500' : 'text-emerald-600')}>
              • Measure at the same time of day for consistency
            </Text>
            <Text className={cn('text-xs', isDarkColorScheme ? 'text-emerald-500' : 'text-emerald-600')}>
              • Use a flexible measuring tape
            </Text>
            <Text className={cn('text-xs', isDarkColorScheme ? 'text-emerald-500' : 'text-emerald-600')}>
              • Stand straight and breathe normally while measuring
            </Text>
          </View>
        </TipCard>
      </View>
    </KeyboardAwareScrollView>
  )
}
