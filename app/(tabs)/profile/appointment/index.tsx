import { Feather } from '@expo/vector-icons'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { format } from 'date-fns'
import { BlurView } from 'expo-blur'
import * as Location from 'expo-location'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useDerivedValue, useSharedValue } from 'react-native-reanimated'
import Loading from '~/components/loading'
import { Text } from '~/components/ui/text'
import BranchCard from '~/features/appointment/components/branch-card'
import FloatingButton from '~/features/appointment/components/floating-button'
import { useBookAppointment } from '~/features/appointment/hooks/use-book-appointment'
import { useGetBranches } from '~/features/appointment/hooks/use-get-branches'
import { useGetBranchesWithDirections } from '~/features/appointment/hooks/use-get-branches-with-directions'
import { createCoordinatesArray, decodePolyline } from '~/features/appointment/utils'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { Vehicle } from '~/types/common'
import { BranchWithDirection } from '~/types/order.type'

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
  const [selectedBranch, setSelectedBranch] = useState<BranchWithDirection | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const bottomSheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapView>(null)
  const snapPoints = useMemo(() => ['20%', '40%', '80%'], [])

  const animatedPOIListIndex = useSharedValue<number>(0)
  const animatedPOIListPosition = useSharedValue<number>(SCREEN_HEIGHT)
  const animatedPOIDetailsIndex = useSharedValue<number>(0)
  const animatedPOIDetailsPosition = useSharedValue<number>(SCREEN_HEIGHT)

  const { methods } = useBookAppointment()

  const { setValue } = methods

  const { data: branches, isLoading: isLoadingBranches } = useGetBranches()
  const { branchesWithDirections, isLoading: isLoadingDirections } = useGetBranchesWithDirections(
    userLocation.location,
    branches,
    Vehicle.Bike
  )

  const isLoading = isLoadingBranches || isLoadingDirections || userLocation.isLoading

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

  // Fit map to show both origin and destination
  const fitMapToRoute = useCallback(
    (branch?: BranchWithDirection) => {
      const targetBranch = branch || selectedBranch
      if (userLocation.location && targetBranch && mapRef.current) {
        // Get route coordinates if available
        const routeCoords = targetBranch.directionData?.routes?.[0]?.overview_polyline?.points
          ? decodePolyline(targetBranch.directionData.routes[0].overview_polyline.points)
          : []

        // Use route coordinates if available, otherwise fall back to start/end points
        const coordinates =
          routeCoords.length > 0 ? routeCoords : createCoordinatesArray(userLocation.location, targetBranch)

        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
          animated: true
        })
      }
    },
    [userLocation.location, selectedBranch]
  )

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

  const handleSelectBranch = (branch: BranchWithDirection) => {
    setSelectedBranch(branch)
    setValue('branchId', branch.id)
    fitMapToRoute(branch)
    setCurrentStep(2)
    bottomSheetRef?.current?.snapToIndex(1)
  }

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

  const routeCoordinates = useMemo(() => {
    if (selectedBranch?.directionData?.routes?.[0]?.overview_polyline?.points) {
      return decodePolyline(selectedBranch.directionData.routes[0].overview_polyline.points)
    }
    return []
  }, [selectedBranch])

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

  if (isLoading) {
    return <Loading />
  }

  return (
    <View className='flex-1 relative'>
      {userLocation.location && initialRegion ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          region={initialRegion}
        >
          <Marker coordinate={userLocation.location.coords} title='Your Location' pinColor='red' />

          {selectedBranch && (
            <Marker
              coordinate={{
                longitude: selectedBranch.longitude,
                latitude: selectedBranch.latitude
              }}
              title={selectedBranch.name}
              description={`${selectedBranch.street}, ${selectedBranch.ward}, ${selectedBranch.district}, ${selectedBranch.province}`}
              pinColor='green'
            />
          )}

          {routeCoordinates.length > 0 && (
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
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          animatedPosition={animatedPOIListPosition}
          animatedIndex={animatedPOIListIndex}
          style={{
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
            borderRadius: 16,
            overflow: 'hidden'
          }}
          // backgroundComponent={({ style }) => (
          //   <BlurView
          //     experimentalBlurMethod='dimezisBlurView'
          //     tint='extraLight'
          //     intensity={100}
          //     style={[style, { overflow: 'hidden' }]}
          //   />
          // )}
        >
          <FormProvider {...methods}>
            {appointments && Array.isArray(appointments) && appointments.length > 0 ? (
              <Text className='font-inter-semibold text-lg mb-4'>Appointment Details</Text>
            ) : (
              <>
                <Text className='font-inter-semibold text-xl text-center'>Select a branch</Text>
                {currentStep === 1 && (
                  <BottomSheetFlatList
                    data={branchesWithDirections}
                    keyExtractor={(branch) => branch.id}
                    renderItem={({ item, index }) => (
                      <BranchCard branch={item} onPress={() => handleSelectBranch(item)} isFirstBranch={index === 0} />
                    )}
                    contentContainerClassName='gap-4 p-4'
                    showsVerticalScrollIndicator={false}
                  />
                )}

                {currentStep === 2 && <Text>{selectedBranch?.name}</Text>}
              </>
            )}
          </FormProvider>
        </BottomSheet>
      )}
    </View>
  )
}
