import { Feather, MaterialIcons } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from 'react-native-reanimated'
import DatePicker from '~/components/date-picker'
import FieldError from '~/components/field-error'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { WarningCard } from '~/components/ui/alert-card'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useFieldError } from '~/hooks/use-field-error'
import { KEYBOARD_OFFSET, PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, isFormError } from '~/lib/utils'
import { PregnancyInfoFormInput } from '../../validations'

export default function PregnancyInfoForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<PregnancyInfoFormInput>()

  const className = useFieldError()

  return (
    <KeyboardAwareScrollView bottomOffset={KEYBOARD_OFFSET} showsVerticalScrollIndicator={false}>
      <View className='flex flex-col gap-4'>
        <View className='mx-4'>
          <WarningCard
            title='Thông Tin Quan Trọng'
            delay={100}
            description='Thông tin này sẽ giúp chúng tôi cung cấp kết quả và gợi ý chính xác nhất.'
          />
        </View>

        <Animated.View entering={FadeInDown.delay(200)} className='flex flex-col gap-1 px-4'>
          <View className='flex flex-col gap-1'>
            <Text className='font-inter-semibold'>Chi Tiết Thai Kỳ</Text>
            <Text className='text-muted-foreground text-xs'>
              Vui lòng cung cấp thông tin chính xác về thai kỳ của bạn để giúp chúng tôi tính toán các ngày và số đo
              quan trọng.
            </Text>
          </View>

          <View className='flex flex-col gap-2 mt-4'>
            {/* First date of last period */}
            <DatePicker
              control={control}
              name='firstDateOfLastPeriod'
              placeholder='Ngày Đầu Tiên Của Kỳ Kinh Cuối'
              required
              errors={errors}
            />
            {isFormError(errors, 'firstDateOfLastPeriod') ? (
              <FieldError message={errors.firstDateOfLastPeriod?.message || ''} />
            ) : null}

            {/* Number of pregnancy */}
            <Controller
              control={control}
              name='numberOfPregnancy'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Số Thai Kỳ'
                  keyboardType='numeric'
                  StartIcon={<MaterialIcons name='numbers' size={20} color={PRIMARY_COLOR.LIGHT} />}
                  {...field}
                  value={value}
                  onChangeText={onChange}
                  className={cn(
                    'bg-background border-input',
                    isFormError(errors, 'numberOfPregnancy') ? className : ''
                  )}
                />
              )}
            />
            {isFormError(errors, 'numberOfPregnancy') ? (
              <FieldError message={errors.numberOfPregnancy?.message || ''} />
            ) : null}
          </View>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300)} className='flex flex-col gap-1 px-4'>
          <View className='flex flex-col gap-1'>
            <Text className='font-inter-semibold'>Số Đo Cơ Thể</Text>
            <Text className='text-muted-foreground text-xs'>
              Số đo hiện tại của bạn giúp chúng tôi theo dõi các thay đổi trong suốt thai kỳ của bạn.
            </Text>
          </View>

          <View className='flex flex-col gap-2 mt-4'>
            {/* Bust */}
            <Controller
              control={control}
              name='bust'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Vòng Eo'
                  keyboardType='numeric'
                  StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                  {...field}
                  value={value}
                  onChangeText={onChange}
                  className={cn('bg-background border-input', isFormError(errors, 'bust') ? className : '')}
                  EndIcon={<Text className='text-muted-foreground text-sm'>cm</Text>}
                />
              )}
            />
            {isFormError(errors, 'bust') && <FieldError message={errors.bust?.message || ''} />}

            {/* Waist */}
            <Controller
              control={control}
              name='waist'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Vòng Mông'
                  keyboardType='numeric'
                  StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                  {...field}
                  value={value}
                  onChangeText={onChange}
                  className={cn('bg-background border-input', isFormError(errors, 'waist') ? className : '')}
                  EndIcon={<Text className='text-muted-foreground text-sm'>cm</Text>}
                />
              )}
            />
            {isFormError(errors, 'waist') && <FieldError message={errors.waist?.message || ''} />}

            {/* Hip */}
            <Controller
              control={control}
              name='hip'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Vòng Mông'
                  keyboardType='numeric'
                  StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                  {...field}
                  value={value}
                  onChangeText={onChange}
                  className={cn('bg-background border-input', isFormError(errors, 'hip') ? className : '')}
                  EndIcon={<Text className='text-muted-foreground text-sm'>cm</Text>}
                />
              )}
            />
            {isFormError(errors, 'hip') && <FieldError message={errors.hip?.message || ''} />}
          </View>
        </Animated.View>

        <View className='h-2 bg-muted' />

        <Animated.View entering={FadeInDown.delay(400)} className='px-4'>
          <View className='flex flex-col gap-1'>
            <Text className='font-inter-semibold'>Chi Tiết Thêm</Text>
            <Text className='text-muted-foreground text-xs'>
              Cung cấp thông tin thêm để giúp chúng tôi hiểu rõ hơn về chuyển động thai kỳ của bạn.
            </Text>
          </View>

          <Accordion type='multiple' collapsible className='w-full max-w-sm native:max-w-md pb-10'>
            <AccordionItem value='menstrual-cycle'>
              <AccordionTrigger>
                <Text className='font-inter-medium'>Chu Kỳ Kinh</Text>
              </AccordionTrigger>
              <AccordionContent>
                <View className='flex flex-col gap-4'>
                  {/* Average cycle length */}
                  <Controller
                    control={control}
                    name='averageMenstrualCycle'
                    render={({ field: { onChange, value, ...field } }) => (
                      <Input
                        placeholder='Chiều Dài Chu Kỳ Kinh Trung Bình'
                        keyboardType='numeric'
                        StartIcon={<Feather name='repeat' size={20} color={PRIMARY_COLOR.LIGHT} />}
                        {...field}
                        value={value ?? undefined}
                        onChangeText={onChange}
                        className={cn(
                          'bg-background border-input',
                          isFormError(errors, 'averageMenstrualCycle') ? className : ''
                        )}
                        EndIcon={<Text className='text-muted-foreground native:text-sm'>ngày</Text>}
                      />
                    )}
                  />
                  {isFormError(errors, 'averageMenstrualCycle') ? (
                    <FieldError message={errors.averageMenstrualCycle?.message || ''} />
                  ) : null}
                </View>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='ultrasound'>
              <AccordionTrigger>
                <Text className='font-inter-medium'>Siêu Âm</Text>
              </AccordionTrigger>
              <AccordionContent>
                <View className='flex flex-col gap-4'>
                  {/* Weeks from ultrasound */}
                  <Controller
                    control={control}
                    name='weeksFromUltrasound'
                    render={({ field: { onChange, value, ...field } }) => (
                      <Input
                        placeholder='Tuần Siêu Âm'
                        keyboardType='numeric'
                        StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                        {...field}
                        value={value ?? undefined}
                        onChangeText={onChange}
                        className={cn(
                          'bg-background border-input',
                          isFormError(errors, 'weeksFromUltrasound') ? className : ''
                        )}
                        EndIcon={<Text className='text-muted-foreground native:text-sm'>tuần</Text>}
                      />
                    )}
                  />
                  {isFormError(errors, 'weeksFromUltrasound') ? (
                    <FieldError message={errors.weeksFromUltrasound?.message || ''} />
                  ) : null}

                  {/* Ultrasound date */}
                  <DatePicker
                    control={control}
                    name='ultrasoundDate'
                    placeholder='Ngày Siêu Âm'
                    required
                    errors={errors}
                  />
                  {isFormError(errors, 'ultrasoundDate') ? (
                    <FieldError message={errors.ultrasoundDate?.message || ''} />
                  ) : null}

                  {/* Due date from ultrasound */}
                  {/* <DatePicker
                    control={control}
                    name='dueDateFromUltrasound'
                    placeholder='Ngày Dự Đoán'
                    required
                    errors={errors}
                  />
                  {isFormError(errors, 'dueDateFromUltrasound') ? (
                    <FieldError message={errors.dueDateFromUltrasound?.message || ''} />
                  )} */}
                </View>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Animated.View>
      </View>
    </KeyboardAwareScrollView>
  )
}
