import { FontAwesome } from '@expo/vector-icons'
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

const measurementCategories = [
  {
    title: 'Upper Body Measurements',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'Neck', value: '15.2', unit: 'cm' },
      { name: 'Coat', value: '42.5', unit: 'cm' },
      { name: 'Bust', value: '36.0', unit: 'cm' },
      { name: 'Chest around', value: '38.5', unit: 'cm' },
      { name: 'Shoulder width', value: '17.2', unit: 'cm' }
    ]
  },
  {
    title: 'Core & Waist Measurements',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'Stomach', value: '32.8', unit: 'cm' },
      { name: 'Pants waist', value: '30.5', unit: 'cm' },
      { name: 'Waist', value: '28.2', unit: 'cm' },
      { name: 'Hip', value: '38.0', unit: 'cm' }
    ]
  },
  {
    title: 'Lower Body Measurements',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'Thigh', value: '24.5', unit: 'cm' },
      { name: 'Leg length', value: '32.0', unit: 'cm' }
    ]
  },
  {
    title: 'Garment Specific Measurements',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'Dress length', value: '45.2', unit: 'cm' },
      { name: 'Sleeve length', value: '24.8', unit: 'cm' }
    ]
  }
]

export default function ReviewMeasurements() {
  const { isDarkColorScheme } = useColorScheme()
  const { width } = useWindowDimensions()

  const keyboardHeight = useKeyboardOffset()

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
        {measurementCategories.map((category, categoryIndex) => (
          <Animated.View key={category.title} entering={FadeInDown.delay(200 + categoryIndex * 100)}>
            <Card className='p-4'>
              <View className='flex flex-row items-center gap-3 mb-4'>
                <View
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    isDarkColorScheme ? 'bg-primary/15' : 'bg-primary/10'
                  )}
                >
                  {category.icon}
                </View>
                <Text className='font-inter-semibold text-primary'>{category.title}</Text>
              </View>
              <View className='flex flex-col gap-3'>
                {category.measurements.map((measurement, index) => (
                  <Dialog key={measurement.name}>
                    <DialogTrigger asChild>
                      <TouchableOpacity>
                        <Animated.View
                          key={measurement.name}
                          entering={FadeInDown.delay(300 + categoryIndex * 100 + index * 50)}
                          className='flex flex-row items-center justify-between py-2 px-3 rounded-lg bg-muted'
                        >
                          <Text className='font-inter-medium'>{measurement.name}</Text>

                          <View className='flex flex-row items-baseline gap-1'>
                            <Text className='text-primary font-inter-semibold text-lg'>{measurement.value}</Text>
                            <Text className='font-inter-medium text-sm text-muted-foreground'>{measurement.unit}</Text>
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
