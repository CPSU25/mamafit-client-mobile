import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { ScrollView, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import DatePicker from '~/components/date-picker'
import FieldError from '~/components/field-error'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useFieldError } from '~/hooks/use-field-error'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, isFormError } from '~/lib/utils'
import { PregnancyInfoFormSchema } from './validations'

export default function PregnancyInfoForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<PregnancyInfoFormSchema>()
  const { isDarkColorScheme } = useColorScheme()
  const className = useFieldError()

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className='flex flex-col gap-4'>
        <Animated.View
          entering={FadeInDown.delay(100)}
          className={cn(
            'border rounded-2xl p-4 mx-4',
            isDarkColorScheme ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-500/20 border-amber-300/60'
          )}
        >
          <View className='flex flex-row items-baseline gap-3'>
            <FontAwesome5 name='exclamation-triangle' size={16} color={isDarkColorScheme ? '#f59e0b' : '#d97706'} />
            <View className='flex flex-col gap-0.5 flex-shrink'>
              <Text className={cn('font-inter-semibold', isDarkColorScheme ? 'text-amber-500' : 'text-amber-600')}>
                Important Information
              </Text>
              <Text className={cn('text-xs', isDarkColorScheme ? 'text-amber-500' : 'text-amber-600')}>
                This information will assist us in delivering the most precise results and recommendations.
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} className='flex flex-col gap-1 px-4'>
          <View className='flex flex-col gap-1'>
            <Text className='font-inter-semibold'>Pregnancy Details</Text>
            <Text className='text-muted-foreground text-xs'>
              Please provide accurate information about your pregnancy to help us calculate important dates and
              measurements.
            </Text>
          </View>

          <View className='flex flex-col gap-2 mt-4'>
            {/* First date of last period */}
            <DatePicker
              control={control}
              name='firstDateOfLastPeriod'
              placeholder='First date of last period'
              required
              errors={errors}
            />
            {isFormError(errors, 'firstDateOfLastPeriod') && (
              <FieldError message={errors.firstDateOfLastPeriod?.message || ''} />
            )}

            {/* Number of pregnancy */}
            <Controller
              control={control}
              name='numberOfPregnancy'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Number of pregnancy'
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
            {isFormError(errors, 'numberOfPregnancy') && (
              <FieldError message={errors.numberOfPregnancy?.message || ''} />
            )}
          </View>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300)} className='flex flex-col gap-1 px-4'>
          <View className='flex flex-col gap-1'>
            <Text className='font-inter-semibold'>Body Measurements</Text>
            <Text className='text-muted-foreground text-xs'>
              Your current measurements help us track changes throughout your pregnancy.
            </Text>
          </View>

          <View className='flex flex-col gap-2 mt-4'>
            {/* Bust */}
            <Controller
              control={control}
              name='bust'
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  placeholder='Bust circumference (cm)'
                  keyboardType='numeric'
                  StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                  {...field}
                  value={value}
                  onChangeText={onChange}
                  className={cn('bg-background border-input', isFormError(errors, 'bust') ? className : '')}
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
                  placeholder='Waist circumference (cm)'
                  keyboardType='numeric'
                  StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                  {...field}
                  value={value}
                  onChangeText={onChange}
                  className={cn('bg-background border-input', isFormError(errors, 'waist') ? className : '')}
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
                  placeholder='Hip circumference (cm)'
                  keyboardType='numeric'
                  StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                  {...field}
                  value={value}
                  onChangeText={onChange}
                  className={cn('bg-background border-input', isFormError(errors, 'hip') ? className : '')}
                />
              )}
            />
            {isFormError(errors, 'hip') && <FieldError message={errors.hip?.message || ''} />}
          </View>
        </Animated.View>

        <View className='h-2 bg-muted' />

        <Animated.View entering={FadeInDown.delay(400)} className='px-4'>
          <View className='flex flex-col gap-1'>
            <Text className='font-inter-semibold'>Additional Details</Text>
            <Text className='text-muted-foreground text-xs'>
              Provide extra information to help us better understand your pregnancy journey.
            </Text>
          </View>

          <Accordion type='multiple' collapsible className='w-full max-w-sm native:max-w-md pb-16 mt-4'>
            <AccordionItem value='menstrual-cycle'>
              <AccordionTrigger>
                <Text className='font-inter-medium'>Menstrual Cycle</Text>
              </AccordionTrigger>
              <AccordionContent>
                <View className='flex flex-col gap-4'>
                  {/* Average cycle length */}
                  <Controller
                    control={control}
                    name='averageMenstrualCycle'
                    render={({ field: { onChange, value, ...field } }) => (
                      <Input
                        placeholder='Average cycle length (days)'
                        keyboardType='numeric'
                        StartIcon={<Feather name='repeat' size={20} color={PRIMARY_COLOR.LIGHT} />}
                        {...field}
                        value={value ?? undefined}
                        onChangeText={onChange}
                        className={cn(
                          'bg-background border-input',
                          isFormError(errors, 'averageMenstrualCycle') ? className : ''
                        )}
                      />
                    )}
                  />
                  {isFormError(errors, 'averageMenstrualCycle') && (
                    <FieldError message={errors.averageMenstrualCycle?.message || ''} />
                  )}
                </View>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='ultrasound'>
              <AccordionTrigger>
                <Text className='font-inter-medium'>Ultrasound</Text>
              </AccordionTrigger>
              <AccordionContent>
                <View className='flex flex-col gap-4'>
                  {/* Weeks from ultrasound */}
                  <Controller
                    control={control}
                    name='weeksFromUltrasound'
                    render={({ field: { onChange, value, ...field } }) => (
                      <Input
                        placeholder='Weeks from ultrasound'
                        keyboardType='numeric'
                        StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
                        {...field}
                        value={value ?? undefined}
                        onChangeText={onChange}
                        className={cn(
                          'bg-background border-input',
                          isFormError(errors, 'weeksFromUltrasound') ? className : ''
                        )}
                      />
                    )}
                  />
                  {isFormError(errors, 'weeksFromUltrasound') && (
                    <FieldError message={errors.weeksFromUltrasound?.message || ''} />
                  )}

                  {/* Ultrasound date */}
                  <DatePicker
                    control={control}
                    name='ultrasoundDate'
                    placeholder='Ultrasound date'
                    required
                    errors={errors}
                  />
                  {isFormError(errors, 'ultrasoundDate') && (
                    <FieldError message={errors.ultrasoundDate?.message || ''} />
                  )}

                  {/* Due date from ultrasound */}
                  <DatePicker
                    control={control}
                    name='dueDateFromUltrasound'
                    placeholder='Due date from ultrasound'
                    required
                    errors={errors}
                  />
                  {isFormError(errors, 'dueDateFromUltrasound') && (
                    <FieldError message={errors.dueDateFromUltrasound?.message || ''} />
                  )}
                </View>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Animated.View>
      </View>
    </ScrollView>
  )
}
