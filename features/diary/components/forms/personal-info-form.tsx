import { Feather, MaterialIcons } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from 'react-native-reanimated'
import FieldError from '~/components/field-error'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useFieldError } from '~/hooks/use-field-error'
import { KEYBOARD_OFFSET, PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, isFormError } from '~/lib/utils'
import { PersonalInfoFormInput } from '../../validations'

export default function PersonalInfoForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<PersonalInfoFormInput>()
  const className = useFieldError()

  return (
    <KeyboardAwareScrollView bottomOffset={KEYBOARD_OFFSET} showsVerticalScrollIndicator={false}>
      <View className='flex flex-col gap-4'>
        <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
          <Text className='font-inter-semibold'>Thông Tin Cơ Bản</Text>
          <Text className='text-muted-foreground text-xs'>
            Vui lòng cung cấp thông tin cơ bản của bạn để giúp chúng tôi cá nhân hóa trải nghiệm của bạn.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} className='flex flex-col gap-2'>
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                placeholder='Tên Nhật Ký'
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
          <Text className='font-inter-semibold'>Số Đo Cơ Thể</Text>
          <Text className='text-muted-foreground text-xs'>Số đo của bạn giúp chúng tôi cung cấp gợi ý chính xác.</Text>

          <View className='flex flex-col gap-2 mt-4'>
            <Controller
              control={control}
              name='weight'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Cân Nặng'
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
                  placeholder='Chiều Cao'
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
          <Text className='font-inter-semibold'>Chi Tiết Cá Nhân</Text>
          <Text className='text-muted-foreground text-xs'>
            Tuổi của bạn giúp chúng tôi tính toán các chỉ số sức khỏe quan trọng.
          </Text>

          <View className='flex flex-col gap-2 mt-4'>
            <Controller
              control={control}
              name='age'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Tuổi'
                  keyboardType='numeric'
                  StartIcon={<MaterialIcons name='numbers' size={20} color={PRIMARY_COLOR.LIGHT} />}
                  {...field}
                  value={value}
                  onChangeText={onChange}
                  className={cn('bg-background border-input', isFormError(errors, 'age') ? className : '')}
                  EndIcon={<Text className='text-muted-foreground text-sm'>tuổi</Text>}
                />
              )}
            />
            {isFormError(errors, 'age') && <FieldError message={errors.age?.message || ''} />}
          </View>
        </Animated.View>
      </View>
    </KeyboardAwareScrollView>
  )
}
