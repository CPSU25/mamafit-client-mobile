import { useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Image, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { AddAddressFormSchema } from '../validations'

interface MapProps {
  latitude: number
  longitude: number
  latitudeDelta?: number
  longitudeDelta?: number
}

export default function Map({ latitude, longitude, latitudeDelta = 0.001, longitudeDelta = 0.001 }: MapProps) {
  const { control, setValue } = useFormContext<AddAddressFormSchema>()
  const lastExternalCoords = useRef({ lat: 0, lng: 0 })

  const [region, setRegion] = useState<Region>({
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta
  })

  // Only update region when coordinates change from external sources (geocoding)
  // Not when form values change due to user interaction
  useEffect(() => {
    const hasNewExternalCoords =
      latitude !== 0 &&
      longitude !== 0 &&
      (latitude !== lastExternalCoords.current.lat || longitude !== lastExternalCoords.current.lng)

    if (hasNewExternalCoords) {
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      }

      setRegion(newRegion)
      setValue('latitude', latitude)
      setValue('longitude', longitude)

      // Update our reference to track these external coordinates
      lastExternalCoords.current = { lat: latitude, lng: longitude }
    }
  }, [latitude, longitude, latitudeDelta, longitudeDelta, setValue])

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion)
    // Update form values when user drags the map
    setValue('latitude', newRegion.latitude)
    setValue('longitude', newRegion.longitude)
  }

  return (
    <View className='gap-2'>
      <Controller control={control} name='latitude' render={() => <View style={{ display: 'none' }} />} />
      <Controller control={control} name='longitude' render={() => <View style={{ display: 'none' }} />} />

      <View className='relative rounded-2xl overflow-hidden'>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ width: '100%', height: 140 }}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
        <Image
          source={require('~/assets/images/map-pin.png')}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20'
        />
      </View>
    </View>
  )
}
