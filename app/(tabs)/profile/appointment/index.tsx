import { Feather } from '@expo/vector-icons'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { format, parse } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import * as Location from 'expo-location'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import BookAppointmentForm from '~/features/appointment/components/book-appointment-form'
import BranchCard from '~/features/appointment/components/branch-card'
import FloatingButton from '~/features/appointment/components/floating-button'
import { useBookAppointment } from '~/features/appointment/hooks/use-book-appointment'
import { useGetAvailableSlots } from '~/features/appointment/hooks/use-get-available-slots'
import { useGetBranches } from '~/features/appointment/hooks/use-get-branches'
import { useGetBranchesWithDirections } from '~/features/appointment/hooks/use-get-branches-with-directions'
import { createCoordinatesArray, decodePolyline } from '~/features/appointment/utils'
import { BookAppointmentFormSchema } from '~/features/appointment/validations'
import { useAuth } from '~/hooks/use-auth'
import { KEYBOARD_OFFSET } from '~/lib/constants/constants'
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
  const { user } = useAuth()

  const [userLocation, setUserLocation] = useState<LocationState>({
    location: null,
    errorMsg: null,
    isLoading: true
  })
  const [selectedBranch, setSelectedBranch] = useState<BranchWithDirection | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const { bottom } = useSafeAreaInsets()

  const bottomSheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapView>(null)
  const snapPoints = useMemo(() => ['20%', '40%', '80%'], [])

  const animatedPOIListIndex = useSharedValue<number>(0)
  const animatedPOIListPosition = useSharedValue<number>(SCREEN_HEIGHT)
  const animatedPOIDetailsIndex = useSharedValue<number>(0)
  const animatedPOIDetailsPosition = useSharedValue<number>(SCREEN_HEIGHT)

  const { methods, bookAppointmentMutation } = useBookAppointment()

  const { setValue, handleSubmit, watch } = methods
  const bookingDate = watch('bookingDate')

  const {
    data: branches,
    isLoading: isLoadingBranches,
    refetch: refetchBranches,
    isRefetching: isRefetchingBranches
  } = useGetBranches()
  const {
    branchesWithDirections,
    isLoading: isLoadingDirections,
    refetch: refetchDirections,
    isRefetching: isRefetchingDirections
  } = useGetBranchesWithDirections(userLocation.location, branches, Vehicle.Bike)
  const {
    data: availableSlots,
    isLoading: isLoadingAvailableSlots,
    refetch: refetchAvailableSlots,
    isRefetching: isRefetchingAvailableSlots
  } = useGetAvailableSlots(selectedBranch?.id || '', bookingDate)

  const isLoading = isLoadingBranches || isLoadingDirections || userLocation.isLoading
  const isRefetching = isRefetchingBranches || isRefetchingDirections

  const handleRefreshBranches = useCallback(() => {
    refetchDirections()
    refetchBranches()
  }, [refetchBranches, refetchDirections])

  const handleRefreshSlots = useCallback(() => {
    refetchAvailableSlots()
  }, [refetchAvailableSlots])

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

  const onSubmit: SubmitHandler<BookAppointmentFormSchema> = (data) => {
    if (!user?.userId) return

    console.log({
      userId: user.userId,
      branchId: data.branchId,
      bookingTime: data.bookingTime,
      note: data.note
    })

    bookAppointmentMutation.mutate({
      userId: user.userId,
      branchId: data.branchId,
      bookingTime: data.bookingTime!,
      note: data.note || ''
    })
  }

  const handleSwitchBranch = () => {
    setSelectedBranch(null)
    setValue('branchId', '')
    setCurrentStep(1)
    methods.reset({
      bookingDate: format(new Date(), 'yyyy-MM-dd'),
      branchId: selectedBranch?.id
    })
    bottomSheetRef.current?.snapToIndex(2)
  }

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

      <LinearGradient
        colors={['#5b21b6', '#7c3aed', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          boxShadow: '0 0 10px 0 rgba(109, 40, 217, 0.6)'
        }}
        className='flex-row items-center p-4 absolute top-8 left-2 right-2 z-10 bg-background/50 rounded-2xl overflow-hidden border border-primary/50'
      >
        <View className='flex flex-row items-center gap-4 flex-1'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color='white' />
          </TouchableOpacity>
          <Text className='font-inter-medium text-xl text-white'>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile/appointment/history')}>
          <Feather name='clock' size={24} color='white' />
        </TouchableOpacity>
      </LinearGradient>

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
        >
          <FormProvider {...methods}>
            <View className='flex-1' style={{ paddingBottom: bottom }}>
              {appointments && Array.isArray(appointments) && appointments.length > 0 ? (
                <Text className='font-inter-semibold text-lg mb-4'>Appointment Details</Text>
              ) : (
                <>
                  {currentStep === 1 && (
                    <>
                      <View className='flex-row items-center justify-between px-4'>
                        <View>
                          <Text className='font-inter-semibold text-xl text-center'>Select a branch</Text>
                          <Text className='text-xs text-muted-foreground'>
                            {branchesWithDirections.length} branches available
                          </Text>
                        </View>
                        <TouchableOpacity
                          className='p-3 bg-muted rounded-full'
                          onPress={handleRefreshBranches}
                          disabled={isRefetching}
                        >
                          <Feather name='refresh-ccw' size={18} color='black' />
                        </TouchableOpacity>
                      </View>
                      <BottomSheetFlatList
                        data={branchesWithDirections}
                        keyExtractor={(branch) => branch.id}
                        renderItem={({ item, index }) => (
                          <BranchCard
                            branch={item}
                            onPress={() => handleSelectBranch(item)}
                            isFirstBranch={index === 0}
                          />
                        )}
                        contentContainerClassName='gap-4 p-4'
                        showsVerticalScrollIndicator={false}
                      />
                    </>
                  )}

                  {currentStep === 2 && selectedBranch && (
                    <>
                      <View className='flex-row items-center justify-between px-4'>
                        <View>
                          <Text className='font-inter-semibold text-xl'>{selectedBranch.name} </Text>
                          <Text className='text-xs text-muted-foreground' numberOfLines={1}>
                            Working Hour: {format(parse(selectedBranch.openingHour, 'HH:mm:ss', new Date()), 'hh:mm a')}{' '}
                            - {format(parse(selectedBranch.closingHour, 'HH:mm:ss', new Date()), 'hh:mm a')}
                          </Text>
                        </View>
                        <TouchableOpacity
                          className='p-3 bg-muted rounded-full'
                          onPress={handleRefreshSlots}
                          disabled={isRefetchingAvailableSlots}
                        >
                          <Feather name='refresh-ccw' size={18} color='black' />
                        </TouchableOpacity>
                      </View>
                      <View className='flex-1 gap-4 p-4'>
                        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} bottomOffset={KEYBOARD_OFFSET}>
                          <BookAppointmentForm
                            availableSlots={availableSlots}
                            bookingDate={bookingDate}
                            isLoading={isLoadingAvailableSlots}
                          />
                        </KeyboardAwareScrollView>
                        <View className='flex-1' />
                        <View className='flex-row items-center gap-4 flex-1'>
                          <Button className='flex-1' variant='outline' onPress={handleSwitchBranch}>
                            <Text className='font-inter-medium'>Switch Branch</Text>
                          </Button>
                          <Button
                            className='flex-1'
                            onPress={handleSubmit(onSubmit)}
                            disabled={bookAppointmentMutation.isPending}
                          >
                            <Text className='font-inter-medium'>
                              {bookAppointmentMutation.isPending ? 'Booking...' : 'Book Now!'}
                            </Text>
                          </Button>
                        </View>
                      </View>
                    </>
                  )}
                </>
              )}
            </View>
          </FormProvider>
        </BottomSheet>
      )}
    </View>
  )
}
