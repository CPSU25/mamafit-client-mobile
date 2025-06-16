import { Feather, FontAwesome } from '@expo/vector-icons'
import { ScrollView, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useKeyboardOffset } from '~/hooks/use-keyboard-offset'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { PreviewDiaryResponse } from '~/types/diary.type'

interface ReviewMeasurementsProps {
  measurements: PreviewDiaryResponse | null
}

const defaultMeasurements = [
  {
    title: 'Upper Body',
    description: 'Measurements for the neck, coat, bust, chest around, and shoulder width',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'Neck', value: '0', unit: 'cm' },
      { name: 'Coat', value: '0', unit: 'cm' },
      { name: 'Chest around', value: '0', unit: 'cm' },
      { name: 'Shoulder width', value: '0', unit: 'cm' }
    ]
  },
  {
    title: 'Core & Waist',
    description: 'Measurements for the stomach, pants waist, waist, and hip',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'Stomach', value: '0', unit: 'cm' },
      { name: 'Pants waist', value: '0', unit: 'cm' }
    ]
  },
  {
    title: 'Lower Body',
    description: 'Measurements for the thigh and leg length',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'Thigh', value: '0', unit: 'cm' },
      { name: 'Leg length', value: '0', unit: 'cm' }
    ]
  },
  {
    title: 'Garment Specific',
    description: 'Measurements for the dress length and sleeve length',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'Dress length', value: '0', unit: 'cm' },
      { name: 'Sleeve length', value: '0', unit: 'cm' }
    ]
  }
]

const defaultPregnancyStatus = [
  {
    title: 'Pregnancy Status',
    description: 'Measurements for the gestational age, bust, and weight',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'Gestational age', value: '0', unit: 'weeks' },
      { name: 'Bust', value: '0', unit: 'cm' },
      { name: 'Waist', value: '0', unit: 'cm' },
      { name: 'Hip', value: '0', unit: 'cm' }
    ]
  }
]

const transformMeasurements = (measurements: PreviewDiaryResponse) => {
  return [
    {
      title: 'Upper Body',
      description: 'Measurements for the neck, coat, bust, chest around, and shoulder width',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'Neck', value: measurements.neck.toFixed(1), unit: 'cm' },
        { name: 'Coat', value: measurements.coat.toFixed(1), unit: 'cm' },
        { name: 'Chest around', value: measurements.chestAround.toFixed(1), unit: 'cm' },
        { name: 'Shoulder width', value: measurements.shoulderWidth.toFixed(1), unit: 'cm' }
      ]
    },
    {
      title: 'Core & Waist',
      description: 'Measurements for the stomach, pants waist, waist, and hip',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'Stomach', value: measurements.stomach.toFixed(1), unit: 'cm' },
        { name: 'Pants waist', value: measurements.pantsWaist.toFixed(1), unit: 'cm' }
      ]
    },
    {
      title: 'Lower Body',
      description: 'Measurements for the thigh and leg length',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'Thigh', value: measurements.thigh.toFixed(1), unit: 'cm' },
        { name: 'Leg length', value: measurements.legLength.toFixed(1), unit: 'cm' }
      ]
    },
    {
      title: 'Garment Specific',
      description: 'Measurements for the dress length and sleeve length',
      icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'Dress length', value: measurements.dressLength.toFixed(1), unit: 'cm' },
        { name: 'Sleeve length', value: measurements.sleeveLength.toFixed(1), unit: 'cm' }
      ]
    }
  ]
}

const transformPregnancyStatus = (measurements: PreviewDiaryResponse) => {
  return [
    {
      title: 'Pregnancy Status',
      description: 'Measurements for the gestational age, bust, and weight',
      icon: SvgIcon.calendarOne({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
      measurements: [
        { name: 'Gestational age', value: measurements.weekOfPregnancy, unit: 'weeks' },
        { name: 'Bust', value: measurements.bust.toFixed(2), unit: 'cm' },
        { name: 'Waist', value: measurements.waist.toFixed(2), unit: 'cm' },
        { name: 'Hip', value: measurements.hip.toFixed(2), unit: 'cm' }
      ]
    }
  ]
}

export default function ReviewMeasurements({ measurements }: ReviewMeasurementsProps) {
  const { isDarkColorScheme } = useColorScheme()
  const { width } = useWindowDimensions()

  const keyboardHeight = useKeyboardOffset()

  const transformedMeasurements = measurements ? transformMeasurements(measurements) : defaultMeasurements
  const transformedPregnancyStatus = measurements ? transformPregnancyStatus(measurements) : defaultPregnancyStatus

  return (
    <ScrollView showsVerticalScrollIndicator={false} className='p-4 mb-4'>
      <Animated.View
        entering={FadeInDown.delay(100)}
        className={cn(
          'border rounded-2xl p-4 border-dashed',
          isDarkColorScheme ? 'bg-sky-500/10 border-sky-900' : 'bg-sky-500/20 border-sky-500/30'
        )}
      >
        <View className='flex flex-row items-baseline gap-3'>
          <FontAwesome name='bell' size={16} color={isDarkColorScheme ? '#0ea5e9' : '#0284c7'} />
          <View className='flex flex-col gap-0.5 flex-shrink'>
            <Text className={cn('font-inter-semibold', isDarkColorScheme ? 'text-sky-500' : 'text-sky-600')}>
              Your measurements are ready!
            </Text>
            <Text className={cn('text-xs', isDarkColorScheme ? 'text-sky-500' : 'text-sky-600')}>
              Remember, these measurements are estimates. Please check and update if needed.
            </Text>
          </View>
        </View>
      </Animated.View>

      <View className='flex flex-col gap-4 my-4'>
        {transformedPregnancyStatus.map((status, statusIndex) => (
          <Animated.View key={status.title} entering={FadeInDown.delay(200)}>
            <Card className='p-2'>
              <View className='flex flex-row items-center gap-2 mb-4'>
                <View
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    isDarkColorScheme ? 'bg-primary/15' : 'bg-primary/10'
                  )}
                >
                  {status.icon}
                </View>
                <View>
                  <Text className='font-inter-semibold text-sm uppercase'>{status.title}</Text>
                  <Text className='text-xs text-muted-foreground'>Something wrong? Go back to edit</Text>
                </View>
              </View>
              <View className='flex flex-col gap-2'>
                {status.measurements.map((measurement, index) => (
                  <Animated.View
                    key={measurement.name}
                    entering={FadeInDown.delay(300 + statusIndex * 100 + index * 50)}
                    className='flex flex-row items-center justify-between px-2 py-1'
                  >
                    <Text className='text-sm'>{measurement.name}</Text>

                    <View className='flex flex-row items-baseline gap-1'>
                      <Text className='text-primary font-inter-semibold'>{measurement.value}</Text>
                      <Text className='text-xs text-muted-foreground'>{measurement.unit}</Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Card>
          </Animated.View>
        ))}

        {transformedMeasurements.map((category, categoryIndex) => (
          <Animated.View key={category.title} entering={FadeInDown.delay(300 + categoryIndex * 100)}>
            <Card className='p-2'>
              <View className='flex flex-row items-center gap-2 mb-4'>
                <View
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    isDarkColorScheme ? 'bg-primary/15' : 'bg-primary/10'
                  )}
                >
                  {category.icon}
                </View>
                <View>
                  <Text className='font-inter-semibold text-sm uppercase'>{category.title}</Text>
                  <Text className='text-xs text-muted-foreground'>Tap any measurement to edit</Text>
                </View>
              </View>
              <View className='flex flex-col gap-2'>
                {category.measurements.map((measurement, index) => (
                  <Dialog key={measurement.name}>
                    <DialogTrigger asChild>
                      <TouchableOpacity>
                        <Animated.View
                          key={measurement.name}
                          entering={FadeInDown.delay(300 + categoryIndex * 100 + index * 50)}
                          className='flex flex-row items-center justify-between py-2 px-3 rounded-xl bg-muted'
                        >
                          <Text className='text-sm'>{measurement.name}</Text>

                          <View className='flex flex-row items-baseline gap-1'>
                            <Text className='text-primary font-inter-semibold'>{measurement.value}</Text>
                            <Text className='text-xs text-muted-foreground mr-1.5'>{measurement.unit}</Text>
                            <Feather name='edit' size={12} color='gray' />
                          </View>
                        </Animated.View>
                      </TouchableOpacity>
                    </DialogTrigger>
                    <DialogContent
                      displayCloseButton={false}
                      style={{
                        marginBottom: keyboardHeight / 3,
                        width: width - 30
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Enter your measurement</DialogTitle>
                        <Input
                          placeholder={`${measurement.name} measurement`}
                          autoFocus
                          EndIcon={<Text className='text-muted-foreground text-sm'>cm</Text>}
                        />
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button>
                            <Text className='font-inter-medium'>Submit</Text>
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
              </View>
            </Card>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  )
}
