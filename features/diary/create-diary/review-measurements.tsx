import { Feather, FontAwesome } from '@expo/vector-icons'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
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
import { MeasurementsFormInput } from './validations'

interface MeasurementFieldProps {
  name: keyof MeasurementsFormInput
  label: string
  unit: string
  categoryIndex: number
  measurementIndex: number
  editable?: boolean
}

function MeasurementField({
  name,
  label,
  unit,
  categoryIndex,
  measurementIndex,
  editable = true
}: MeasurementFieldProps) {
  const {
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<MeasurementsFormInput>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tempValue, setTempValue] = useState('')
  const { width } = useWindowDimensions()
  const keyboardHeight = useKeyboardOffset()

  const currentValue = watch(name)
  const error = errors[name]

  const handleEdit = () => {
    setTempValue(currentValue)
    setDialogOpen(true)
  }

  const handleSave = () => {
    setValue(name, tempValue, { shouldValidate: true })
    setDialogOpen(false)
  }

  const getDisplayValue = () => {
    const value = parseFloat(currentValue)
    if (isNaN(value) || value === 0) return '0'
    if (name === 'weekOfPregnancy') return value
    return value.toFixed(1)
  }

  if (!editable) {
    return (
      <Animated.View
        entering={FadeInDown.delay(300 + categoryIndex * 100 + measurementIndex * 50)}
        className={cn('flex flex-row items-center justify-between py-0.5 px-2')}
      >
        <Text className='text-sm'>{label}</Text>

        <View className='flex flex-row items-baseline gap-1'>
          <Text className='text-primary font-inter-semibold'>{getDisplayValue()}</Text>
          <Text className='text-xs text-muted-foreground'>{unit}</Text>
        </View>
      </Animated.View>
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <TouchableOpacity onPress={handleEdit}>
          <Animated.View
            entering={FadeInDown.delay(300 + categoryIndex * 100 + measurementIndex * 50)}
            className={cn(
              'flex flex-row items-center justify-between py-2 px-3 rounded-xl bg-muted border',
              error ? 'border-destructive' : 'border-transparent'
            )}
          >
            <View className='flex-1'>
              <Text className='text-sm'>{label}</Text>
              {error && <Text className='text-xs text-destructive mt-0.5'>{error.message}</Text>}
            </View>

            <View className='flex flex-row items-baseline gap-1'>
              <Text className='text-primary font-inter-semibold'>{getDisplayValue()}</Text>
              <Text className='text-xs text-muted-foreground mr-1.5'>{unit}</Text>
              <Feather name='edit' size={12} color='gray' />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </DialogTrigger>
      <DialogContent
        displayCloseButton={false}
        style={{
          marginBottom: keyboardHeight / 3,
          width: width - 30,
          padding: 16
        }}
      >
        <DialogHeader>
          <DialogTitle>Enter your {label.toLowerCase()}</DialogTitle>
          <Input
            placeholder={`${label} measurement`}
            value={tempValue}
            onChangeText={setTempValue}
            autoFocus
            keyboardType='decimal-pad'
            EndIcon={<Text className='text-muted-foreground text-sm'>{unit}</Text>}
          />
        </DialogHeader>
        <DialogFooter className='flex flex-row gap-2'>
          <DialogClose asChild>
            <Button variant='outline' onPress={() => setDialogOpen(false)} className='flex-1'>
              <Text className='font-inter-medium'>Cancel</Text>
            </Button>
          </DialogClose>
          <Button onPress={handleSave} className='flex-1'>
            <Text className='font-inter-medium'>Save</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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

export default function ReviewMeasurements() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <ScrollView showsVerticalScrollIndicator={false} className='p-4 mb-4'>
      <View className='flex flex-col gap-4 mb-4'>
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
