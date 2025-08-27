import { Info, Weight } from 'lucide-react-native'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from 'react-native-reanimated'
import FieldError from '~/components/field-error'
import { TipCard } from '~/components/ui/alert-card'
import { Icon } from '~/components/ui/icon'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useFieldError } from '~/hooks/use-field-error'
import { KEYBOARD_OFFSET, PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, isFormError } from '~/lib/utils'
import { PreviewMeasurementFormInput } from '../../validations'

export default function PreviewMeasurementForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<PreviewMeasurementFormInput>()
  const { isDarkColorScheme } = useColorScheme()

  const className = useFieldError()

  return (
    <KeyboardAwareScrollView bottomOffset={KEYBOARD_OFFSET} showsVerticalScrollIndicator={false}>
      <View className='gap-4'>
        {/* Weight Section */}
        <Animated.View entering={FadeInDown.delay(100)} className='gap-2'>
          <View>
            <Text className='font-inter-medium'>Cân nặng</Text>
            <Text className='text-muted-foreground text-xs'>Nhập cân nặng hiện tại của bạn</Text>
          </View>
          <Controller
            control={control}
            name='weight'
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                placeholder='Cân nặng'
                keyboardType='numeric'
                StartIcon={<Icon as={Weight} size={20} color={PRIMARY_COLOR.LIGHT} />}
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
        <Animated.View entering={FadeInDown.delay(200)} className='gap-2'>
          <View>
            <Text className='font-inter-medium text-sm'>Số đo 3 vòng</Text>
            <Text className='text-muted-foreground text-xs'>
              Thông tin này giúp chúng tôi tính toán các số đo cần thiết.
            </Text>
          </View>

          <View className='flex flex-col gap-2'>
            {/* Bust */}
            <View className='flex flex-col gap-2'>
              <Controller
                control={control}
                name='bust'
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    placeholder='Vòng ngực'
                    keyboardType='numeric'
                    StartIcon={<Icon as={Info} size={20} color={PRIMARY_COLOR.LIGHT} />}
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
                    placeholder='Vòng eo'
                    keyboardType='numeric'
                    StartIcon={<Icon as={Info} size={20} color={PRIMARY_COLOR.LIGHT} />}
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
                    placeholder='Vòng hông'
                    keyboardType='numeric'
                    StartIcon={<Icon as={Info} size={20} color={PRIMARY_COLOR.LIGHT} />}
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
              • Đo cùng một thời điểm để đảm bảo tính đồng nhất.
            </Text>
            <Text className={cn('text-xs', isDarkColorScheme ? 'text-emerald-500' : 'text-emerald-600')}>
              • Sử dụng thước đo mềm.
            </Text>
            <Text className={cn('text-xs', isDarkColorScheme ? 'text-emerald-500' : 'text-emerald-600')}>
              • Đứng thẳng và thở bình thường trong khi đo.
            </Text>
          </View>
        </TipCard>
      </View>
    </KeyboardAwareScrollView>
  )
}
