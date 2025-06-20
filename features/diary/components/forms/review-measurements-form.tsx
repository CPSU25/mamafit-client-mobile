import { ScrollView, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { InfoCard } from '~/components/ui/alert-card'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { MeasurementField } from '~/features/diary/components/measurement-field'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'

const measurementCategories = [
  {
    title: 'Pregnancy Status',
    description: 'Something wrong? Go back to edit',
    icon: SvgIcon.calendarOne({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'weekOfPregnancy' as const, label: 'Gestational age', unit: 'weeks', editable: false },
      { name: 'bust' as const, label: 'Bust', unit: 'cm', editable: false },
      { name: 'waist' as const, label: 'Waist', unit: 'cm', editable: false },
      { name: 'hip' as const, label: 'Hip', unit: 'cm', editable: false }
    ]
  },
  {
    title: 'Upper Body',
    description: 'Tap any measurement to edit',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'neck' as const, label: 'Neck', unit: 'cm', editable: true },
      { name: 'coat' as const, label: 'Coat', unit: 'cm', editable: true },
      { name: 'chestAround' as const, label: 'Chest around', unit: 'cm', editable: true },
      { name: 'shoulderWidth' as const, label: 'Shoulder width', unit: 'cm', editable: true }
    ]
  },
  {
    title: 'Core & Waist',
    description: 'Tap any measurement to edit',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'stomach' as const, label: 'Stomach', unit: 'cm', editable: true },
      { name: 'pantsWaist' as const, label: 'Pants waist', unit: 'cm', editable: true }
    ]
  },
  {
    title: 'Lower Body',
    description: 'Tap any measurement to edit',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'thigh' as const, label: 'Thigh', unit: 'cm', editable: true },
      { name: 'legLength' as const, label: 'Leg length', unit: 'cm', editable: true }
    ]
  },
  {
    title: 'Garment Specific',
    description: 'Tap any measurement to edit',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'dressLength' as const, label: 'Dress length', unit: 'cm', editable: true },
      { name: 'sleeveLength' as const, label: 'Sleeve length', unit: 'cm', editable: true }
    ]
  }
]

export default function ReviewMeasurementsForm() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <ScrollView showsVerticalScrollIndicator={false} className='p-4 mb-4'>
      <View className='flex flex-col gap-4 mb-4'>
        <InfoCard
          title='Your measurements are ready!'
          delay={100}
          description='Remember, these measurements are estimates. Please check and update if needed.'
        />

        {measurementCategories.map((category, categoryIndex) => (
          <Animated.View
            key={category.title}
            entering={FadeInDown.delay(200 + categoryIndex * 100)}
            className='rounded-2xl'
          >
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
                  <Text className='text-xs text-muted-foreground'>{category.description}</Text>
                </View>
              </View>
              <View className='flex flex-col gap-2'>
                {category.measurements.map((measurement, index) => (
                  <MeasurementField
                    key={measurement.name}
                    name={measurement.name}
                    label={measurement.label}
                    unit={measurement.unit}
                    categoryIndex={categoryIndex}
                    measurementIndex={index}
                    editable={measurement.editable}
                  />
                ))}
              </View>
            </Card>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  )
}
