import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { Text, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { styles } from '~/lib/constants/constants'
import { PaymentType, PlacePresetOrderFormSchema } from '../../validations'

export default function PaymentMethodsSection() {
  const { control } = useFormContext<PlacePresetOrderFormSchema>()

  return (
    <Card className='p-2 flex flex-col gap-4 text-sky-50' style={[styles.container]}>
      <Controller
        control={control}
        name='paymentType'
        render={({ field: { value, onChange } }) => (
          <RadioGroup value={value} onValueChange={(val) => onChange(val as PaymentType)} className='gap-2'>
            <RadioGroupItemWithLabel
              value='FULL'
              onPress={() => onChange('FULL')}
              label='Full Payment (Banking)'
              iconColor='#38bdf8'
              backgroundColor='#f0f9ff'
              description='Pay the full amount now'
            />
            <RadioGroupItemWithLabel
              value='DEPOSIT'
              onPress={() => onChange('DEPOSIT')}
              label='Deposit 50% (Banking)'
              iconColor='#fbbf24'
              backgroundColor='#fffbeb'
              description='Pay 50% of the total amount now'
            />
          </RadioGroup>
        )}
      />
    </Card>
  )
}

const RadioGroupItemWithLabel = ({
  value,
  onPress,
  label,
  iconColor,
  backgroundColor,
  description
}: {
  value: string
  onPress: () => void
  label: string
  iconColor: string
  backgroundColor: string
  description: string
}) => {
  return (
    <TouchableOpacity className='flex-row justify-between items-center p-2 rounded-xl' onPress={onPress}>
      <View className='flex flex-row items-center gap-3'>
        <View className='p-2 rounded-full' style={{ backgroundColor }}>
          <MaterialCommunityIcons name='credit-card' size={20} color={iconColor} />
        </View>
        <View>
          <Label className='native:text-sm font-inter-medium' nativeID={`label-for-${value}`} onPress={onPress}>
            {label}
          </Label>
          <Text className='text-xs text-muted-foreground'>{description}</Text>
        </View>
      </View>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
    </TouchableOpacity>
  )
}
