import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { Text, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { PaymentType } from '~/types/order.type'
import { PlacePresetOrderFormSchema } from '../../validations'

interface PaymentMethodsSectionProps {
  iconSize: number
  depositRate: number
}

export default function PaymentMethodsSection({ iconSize, depositRate }: PaymentMethodsSectionProps) {
  const { control } = useFormContext<PlacePresetOrderFormSchema>()

  return (
    <Card className='p-3' style={[styles.container]}>
      <Controller
        control={control}
        name='paymentType'
        render={({ field: { value, onChange } }) => (
          <RadioGroup value={value} onValueChange={(val) => onChange(val as PaymentType)} className='gap-3'>
            <RadioGroupItemWithLabel
              value='FULL'
              onPress={() => onChange('FULL')}
              label='Thanh Toán Đầy Đủ (Ngân Hàng)'
              description='Thanh Toán đầy đủ ngay lập tức'
              icon={<MaterialCommunityIcons name='credit-card-check' size={iconSize} color={PRIMARY_COLOR.LIGHT} />}
            />
            <RadioGroupItemWithLabel
              value='DEPOSIT'
              onPress={() => onChange('DEPOSIT')}
              label={`Cọc ${depositRate * 100}% (Ngân Hàng)`}
              description={`Thanh Toán ${depositRate * 100}% của tổng số tiền ngay lập tức`}
              icon={<MaterialCommunityIcons name='credit-card-clock' size={iconSize} color={PRIMARY_COLOR.LIGHT} />}
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
  description,
  icon
}: {
  value: string
  onPress: () => void
  label: string
  description: string
  icon: React.ReactNode
}) => {
  return (
    <TouchableOpacity className='flex-row justify-between items-center rounded-xl' onPress={onPress}>
      <View className='flex flex-row items-center gap-2'>
        {icon}
        <View>
          <Label className='native:text-sm font-inter-medium' nativeID={`label-for-${value}`} onPress={onPress}>
            {label}
          </Label>
          <Text className='text-xs text-muted-foreground'>{description}</Text>
        </View>
      </View>
      <RadioGroupItem className='mr-1.5' aria-labelledby={`label-for-${value}`} value={value} />
    </TouchableOpacity>
  )
}
