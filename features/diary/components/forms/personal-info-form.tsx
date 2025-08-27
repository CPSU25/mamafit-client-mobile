import { Book, Hash, Ruler, Weight } from 'lucide-react-native'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from 'react-native-reanimated'
import FieldError from '~/components/field-error'
import { Icon } from '~/components/ui/icon'
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
      <View className='gap-4'>
        <View className='gap-2'>
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text className='font-inter-medium'>Thông tin cơ bản</Text>
            <Text className='text-muted-foreground text-xs'>
              Vui lòng cung cấp thông tin cơ bản của bạn để giúp chúng tôi cá nhân hóa trải nghiệm của bạn.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} className='gap-2'>
            <Controller
              control={control}
              name='name'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Tên nhật ký'
                  keyboardType='default'
                  StartIcon={<Icon as={Book} size={20} color={PRIMARY_COLOR.LIGHT} />}
                  {...field}
                  value={value}
                  onChangeText={onChange}
                  className={cn('bg-background border-input', isFormError(errors, 'name') ? className : '')}
                />
              )}
            />
            {isFormError(errors, 'name') && <FieldError message={errors.name?.message || ''} />}
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(300)} className='gap-2'>
          <View>
            <Text className='font-inter-medium'>Số đo cơ thể</Text>
            <Text className='text-muted-foreground text-xs'>
              Số đo của bạn giúp chúng tôi cung cấp gợi ý chính xác.
            </Text>
          </View>

          <View className='gap-2'>
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
                  placeholder='Chiều cao'
                  keyboardType='numeric'
                  StartIcon={<Icon as={Ruler} size={20} color={PRIMARY_COLOR.LIGHT} />}
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

        <Animated.View entering={FadeInDown.delay(400)} className='gap-2'>
          <View>
            <Text className='font-inter-medium'>Thông tin khác</Text>
            <Text className='text-muted-foreground text-xs'>
              Tuổi của bạn giúp chúng tôi tính toán các số đo chính xác hơn.
            </Text>
          </View>

          <View className='gap-2'>
            <Controller
              control={control}
              name='age'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Tuổi'
                  keyboardType='numeric'
                  StartIcon={<Icon as={Hash} size={20} color={PRIMARY_COLOR.LIGHT} />}
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
