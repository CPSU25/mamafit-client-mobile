import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Controller, useFormContext } from 'react-hook-form'
import { Text, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { OrderItemType, PaymentType } from '~/types/order.type'
import { PlaceDressOrderFormSchema, PlacePresetOrderFormSchema } from '../../validations'

interface PaymentMethodsSectionProps {
  iconSize: number
  depositRate: number
  orderType: OrderItemType
  paymentType: PaymentType
}

export default function PaymentMethodsSection({
  iconSize,
  depositRate,
  orderType,
  paymentType
}: PaymentMethodsSectionProps) {
  const { control, setValue } = useFormContext<PlacePresetOrderFormSchema | PlaceDressOrderFormSchema>()

  return (
    <Card className='p-3' style={[styles.container]}>
      <Controller
        control={control}
        name='paymentType'
        render={({ field: { onChange } }) => {
          const handlePaymentTypeChange = (newPaymentType: PaymentType) => {
            onChange(newPaymentType)
            setValue('paymentType', newPaymentType)
          }

          return (
            <RadioGroup
              value={paymentType}
              onValueChange={(val) => handlePaymentTypeChange(val as PaymentType)}
              className='gap-3'
            >
              <RadioGroupItemWithLabel
                value={PaymentType.Full}
                onPress={() => handlePaymentTypeChange(PaymentType.Full)}
                label='Thanh toán hết (Ngân hàng)'
                description='Thanh toán đầy đủ đơn hàng'
                icon={<MaterialCommunityIcons name='credit-card-check' size={iconSize} color={PRIMARY_COLOR.LIGHT} />}
              />
              {orderType === OrderItemType.Preset ? (
                <RadioGroupItemWithLabel
                  value={PaymentType.Deposit}
                  onPress={() => handlePaymentTypeChange(PaymentType.Deposit)}
                  label={`Đặt cọc ${depositRate * 100}% (Ngân hàng)`}
                  description={`Thanh toán ${depositRate * 100}% của tổng số tiền`}
                  icon={<MaterialCommunityIcons name='credit-card-clock' size={iconSize} color={PRIMARY_COLOR.LIGHT} />}
                />
              ) : null}
            </RadioGroup>
          )
        }}
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
