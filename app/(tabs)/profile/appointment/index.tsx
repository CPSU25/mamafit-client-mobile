import { Feather } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import { format } from 'date-fns'
import { BlurView } from 'expo-blur'
import * as Location from 'expo-location'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { Text } from '~/components/ui/text'
import BranchSelectionBottomSheet from '~/features/appointment/components/branch-selection-bottom-sheet'
import FloatingButton from '~/features/appointment/components/floating-button'
import { useGetBranches } from '~/features/appointment/hooks/use-get-branches'
import { createCoordinatesArray, decodePolyline, findNearestBranch } from '~/features/appointment/utils'
import { useGetDirection } from '~/features/user/hooks/use-get-direction'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { Vehicle } from '~/types/common'
import { Branch } from '~/types/order.type'

interface LocationState {
  location: Location.LocationObject | null
  errorMsg: string | null
  isLoading: boolean
}

const appointments: any[] = []
const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function AppointmentScreen() {
  const router = useRouter()

  const [userLocation, setUserLocation] = useState<LocationState>({
    location: null,
    errorMsg: null,
    isLoading: true
  })
  const [showRoute, setShowRoute] = useState(false)
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null)

  const bottomSheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapView>(null)
  const snapPoints = useMemo(() => ['20%', '40%', '60%'], [])

  const animatedPOIListIndex = useSharedValue<number>(0)
  const animatedPOIListPosition = useSharedValue<number>(SCREEN_HEIGHT)
  const animatedPOIDetailsIndex = useSharedValue<number>(0)
  const animatedPOIDetailsPosition = useSharedValue<number>(SCREEN_HEIGHT)

  const { data: branches, isLoading: isLoadingBranches } = useGetBranches()
  const { data: direction, isLoading: isLoadingDirection } = useGetDirection(
    userLocation.location ? `${userLocation.location.coords.latitude},${userLocation.location.coords.longitude}` : '',
    nearestBranch ? `${nearestBranch.latitude},${nearestBranch.longitude}` : '',
    Vehicle.Bike
  )

  const animatedIndex = useDerivedValue(() =>
    animatedPOIListIndex.value > animatedPOIDetailsIndex.value
      ? animatedPOIListIndex.value
      : animatedPOIDetailsIndex.value
  )

  const animatedPosition = useDerivedValue(() =>
    animatedPOIListPosition.value < animatedPOIDetailsPosition.value
      ? animatedPOIListPosition.value
      : animatedPOIDetailsPosition.value
  )
  const formattedDate = useMemo(() => format(new Date(), 'eeee, MMM d, yyyy'), [])

  // Find nearest branch when location or branches change
  useEffect(() => {
    if (userLocation.location && branches && branches.length > 0) {
      const nearest = findNearestBranch(userLocation.location, branches)
      setNearestBranch(nearest)
    }
  }, [userLocation.location, branches])

  // Fit map to show both origin and destination
  const fitMapToRoute = useCallback(() => {
    if (userLocation.location && nearestBranch && mapRef.current) {
      const coordinates = createCoordinatesArray(userLocation.location, nearestBranch)

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
        animated: true
      })
    }
  }, [userLocation.location, nearestBranch])

  useFocusEffect(
    useCallback(() => {
      const getCurrentLocation = async () => {
        try {
          setUserLocation((prev) => ({ ...prev, isLoading: true }))

          const { status } = await Location.requestForegroundPermissionsAsync()
          if (status !== 'granted') {
            setUserLocation({
              location: null,
              errorMsg: 'Permission to access location was denied',
              isLoading: false
            })
            return
          }

          let loc = await Location.getLastKnownPositionAsync()

          if (!loc) {
            loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced
            })
          }

          setUserLocation({
            location: loc,
            errorMsg: null,
            isLoading: false
          })
        } catch {
          setUserLocation({
            location: null,
            errorMsg: 'Failed to fetch location',
            isLoading: false
          })
        }
      }

      getCurrentLocation()
    }, [])
  )

  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }, [router])

  const jumpToCurrentLocation = useCallback(() => {
    if (userLocation.location && mapRef.current) {
      const region: Region = {
        longitude: userLocation.location.coords.longitude,
        latitude: userLocation.location.coords.latitude,
        longitudeDelta: 0.01,
        latitudeDelta: 0.01
      }
      mapRef.current.animateToRegion(region)
      bottomSheetRef.current?.snapToIndex(0)
    }
  }, [userLocation.location])

  const handleFindNearestBranch = useCallback(() => {
    setShowRoute(true)
    fitMapToRoute()
    bottomSheetRef?.current?.snapToIndex(1)
  }, [fitMapToRoute])

  const routeCoordinates = useMemo(() => {
    if (direction?.routes?.[0]?.overview_polyline?.points) {
      return decodePolyline(direction.routes[0].overview_polyline.points)
    }
    return []
  }, [direction])

  const initialRegion = useMemo(() => {
    if (userLocation.location) {
      return {
        longitude: userLocation.location.coords.longitude,
        latitude: userLocation.location.coords.latitude,
        longitudeDelta: 0.01,
        latitudeDelta: 0.01
      }
    }
    return undefined
  }, [userLocation.location])

  return (
    <View className='flex-1 relative'>
      {userLocation.isLoading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color={PRIMARY_COLOR.LIGHT} />
          <Text className='mt-4 text-muted-foreground text-sm'>Fetching your location...</Text>
        </View>
      ) : userLocation.location && initialRegion ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          region={initialRegion}
        >
          <Marker coordinate={userLocation.location.coords} title='Your Location' pinColor='red' />

          {!isLoadingBranches &&
            branches?.map((branch) => (
              <Marker
                key={branch.id}
                coordinate={{
                  longitude: branch.longitude,
                  latitude: branch.latitude
                }}
                title={branch.name}
                description={`${branch.street}, ${branch.ward}, ${branch.district}, ${branch.province}`}
                pinColor={nearestBranch?.id === branch.id ? 'green' : 'blue'}
              />
            ))}

          {showRoute && routeCoordinates.length > 0 && (
            <Polyline coordinates={routeCoordinates} strokeColor='#8b5cf6' strokeWidth={5} lineCap='round' />
          )}
        </MapView>
      ) : (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-rose-500 font-inter-medium'>{userLocation.errorMsg ?? 'Unknown error'}</Text>
        </View>
      )}

      <FloatingButton
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
        onPress={jumpToCurrentLocation}
      />

      <BlurView
        tint='extraLight'
        intensity={100}
        style={styles.container}
        className='flex-row items-center p-4 absolute top-8 left-2 right-2 z-10 bg-background/50 rounded-2xl overflow-hidden border border-border'
      >
        <View className='flex flex-row items-center gap-4 flex-1'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-medium text-xl text-primary'>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile/appointment/history')}>
          <Feather name='clock' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </BlurView>

      {branches && Array.isArray(branches) && branches.length > 0 && (
        <BranchSelectionBottomSheet
          snapPoints={snapPoints}
          animatedIndex={animatedPOIListIndex}
          animatedPosition={animatedPOIListPosition}
          appointments={appointments}
          isLoadingBranches={isLoadingBranches}
          direction={direction}
          isLoadingDirection={isLoadingDirection}
          handleFindNearestBranch={handleFindNearestBranch}
          nearestBranch={nearestBranch}
          showRoute={showRoute}
        />
      )}
    </View>
  )
}
