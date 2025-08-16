import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Text } from '~/components/ui/text'
import { ForwardGeocodingResponse } from '~/types/common'
import { AddAddressFormSchema } from '../validations'
import Map from './map'

interface AddAddressFormProps {
  geocodingData: ForwardGeocodingResponse['results'] | undefined
  isGeocoding: boolean
}

export default function AddAddressForm({ geocodingData, isGeocoding }: AddAddressFormProps) {
  const { control, setValue } = useFormContext<AddAddressFormSchema>()

  const hasValidGeocodingData = geocodingData && geocodingData.length > 0 && geocodingData[0]?.geometry?.location

  useEffect(() => {
    if (hasValidGeocodingData) {
      const location = geocodingData[0].geometry.location
      const placeId = geocodingData[0].place_id

      setValue('latitude', location.lat)
      setValue('longitude', location.lng)
      setValue('mapId', placeId)
    }
  }, [hasValidGeocodingData, geocodingData, setValue])

  const renderMap = () => {
    if (hasValidGeocodingData && !isGeocoding) {
      const location = geocodingData[0].geometry.location
      return <Map latitude={location.lat} longitude={location.lng} latitudeDelta={0.01} longitudeDelta={0.01} />
    }
  }

  return (
    <View className='gap-4'>
      <Controller control={control} name='mapId' render={() => <View style={{ display: 'none' }} />} />

      <View className='gap-1'>
        <Text className='text-sm font-inter-medium text-muted-foreground'>Tỉnh</Text>
        <Controller
          control={control}
          name='province'
          render={({ field: { onChange, value, ...field } }) => (
            <Input placeholder='Tỉnh / Thành phố' value={value} onChangeText={onChange} {...field} />
          )}
        />
      </View>
      <View className='gap-1'>
        <Text className='text-sm font-inter-medium text-muted-foreground'>Quận</Text>
        <Controller
          control={control}
          name='district'
          render={({ field: { onChange, value, ...field } }) => (
            <Input placeholder='Quận / Huyện / Thành phố thuộc tỉnh' value={value} onChangeText={onChange} {...field} />
          )}
        />
      </View>
      <View className='gap-1'>
        <Text className='text-sm font-inter-medium text-muted-foreground'>Phường</Text>
        <Controller
          control={control}
          name='ward'
          render={({ field: { onChange, value, ...field } }) => (
            <Input placeholder='Phường / Xã' value={value} onChangeText={onChange} {...field} />
          )}
        />
      </View>
      <View className='gap-1'>
        <Text className='text-sm font-inter-medium text-muted-foreground'>Đường</Text>
        <Controller
          control={control}
          name='street'
          render={({ field: { onChange, value, ...field } }) => (
            <Input placeholder='Đường' value={value} onChangeText={onChange} {...field} />
          )}
        />
      </View>

      {renderMap()}

      <View className='flex-row justify-between'>
        <Text>Đặt Làm Địa Chỉ Mặc Định</Text>
        <Controller
          control={control}
          name='isDefault'
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} nativeID='airplane-mode' />
          )}
        />
      </View>
    </View>
  )
}
