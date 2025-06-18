import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Button } from '~/components/ui/button'
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
import { useKeyboardOffset } from '~/hooks/use-keyboard-offset'
import { cn } from '~/lib/utils'
import { MeasurementsFormInput } from '../validations'

interface MeasurementFieldProps {
  name: keyof MeasurementsFormInput
  label: string
  unit: string
  categoryIndex: number
  measurementIndex: number
  editable?: boolean
}

export function MeasurementField({
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
