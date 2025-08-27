import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { isBefore, parse } from 'date-fns'
import { FileText } from 'lucide-react-native'
import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import DatePicker from '~/components/date-picker'
import FieldError from '~/components/field-error'
import { InfoCard } from '~/components/ui/alert-card'
import { Icon } from '~/components/ui/icon'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, isFormError } from '~/lib/utils'
import { Slot } from '~/types/appointment.type'
import { BookAppointmentFormSchema } from '../validations'

interface BookAppointmentFormProps {
  availableSlots: Slot[] | null | undefined
  isLoading: boolean
  bookingDate: string
}

const isTimePassed = (date: string, time: string) => {
  const dateTimeStr = `${date} ${time}`
  const dateTime = parse(dateTimeStr, 'yyyy-MM-dd HH:mm:ss', new Date())
  return isBefore(dateTime, new Date())
}

export default function BookAppointmentForm({ availableSlots, bookingDate, isLoading }: BookAppointmentFormProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext<BookAppointmentFormSchema>()

  const validSlots = useMemo(() => {
    return availableSlots?.filter((slot) => !isTimePassed(bookingDate, slot.slot[0]) && !slot.isBooked)
  }, [availableSlots, bookingDate])

  return (
    <View className='gap-4'>
      <InfoCard
        title='Thời gian dự kiến'
        description='Bạn có thể cần phải chờ một chút nếu khách hàng trước đó mất thời gian hơn dự kiến. Cảm ơn bạn đã hiểu.'
        delay={100}
      />

      <Animated.View entering={FadeInDown.delay(200)} className='gap-2'>
        <DatePicker control={control} name='bookingDate' required errors={errors} minDate={new Date()} />
        {isFormError(errors, 'bookingDate') && <FieldError message={errors.bookingDate?.message || ''} />}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)}>
        <Controller
          control={control}
          name='note'
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder='Ghi chú'
              value={value}
              onChangeText={onChange}
              StartIcon={<Icon as={FileText} size={20} color={PRIMARY_COLOR.LIGHT} />}
            />
          )}
        />
      </Animated.View>

      {isLoading ? (
        <Skeleton className='h-72 w-full rounded-2xl' />
      ) : availableSlots && Array.isArray(availableSlots) && availableSlots.length > 0 && !isLoading ? (
        <Controller
          control={control}
          name='bookingSlot'
          render={({ field: { onChange, value } }) => (
            <Animated.View entering={FadeInDown.delay(400)} className='gap-2 pb-1'>
              <View className='mb-2'>
                <Text className='font-inter-medium'>Giờ còn trống</Text>
                <Text className='text-xs text-muted-foreground'>{validSlots?.length} giờ còn trống</Text>
              </View>
              <BottomSheetScrollView showsVerticalScrollIndicator={false} className='h-64'>
                <View className='flex-row flex-wrap gap-2'>
                  {availableSlots
                    .map((item) => ({ ...item, display: item.slot[0].slice(0, 5) }))
                    .map((slot) => {
                      const isDisabled = isTimePassed(bookingDate, slot.slot[0]) || slot.isBooked
                      const isSelected = value === slot.slot[0]

                      return (
                        <TouchableOpacity
                          key={slot.slot[0]}
                          className={cn(
                            'bg-background border border-input rounded-2xl p-2',
                            value === slot.slot[0] && 'bg-primary/10 border-primary',
                            isDisabled && 'opacity-60 border-dashed'
                          )}
                          style={{ width: '31.5%' }}
                          onPress={() => {
                            if (isDisabled) return
                            onChange(slot.slot[0])
                          }}
                          disabled={isDisabled}
                        >
                          <Text className={cn('text-center font-inter-medium', isSelected && 'text-primary')}>
                            {slot.display}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                </View>
              </BottomSheetScrollView>
            </Animated.View>
          )}
        />
      ) : null}
    </View>
  )
}
