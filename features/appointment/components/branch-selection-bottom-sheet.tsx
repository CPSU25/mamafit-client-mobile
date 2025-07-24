import { MaterialCommunityIcons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { forwardRef } from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { DirectionResponse } from '~/types/common'
import { Branch } from '~/types/order.type'

interface BranchSelectionBottomSheetProps {
  appointments: any[]
  isLoadingBranches: boolean
  handleFindNearestBranch: () => void
  snapPoints: string[]
  animatedPosition: SharedValue<number>
  animatedIndex: SharedValue<number>
  nearestBranch: Branch | null
  showRoute: boolean
  direction: DirectionResponse | undefined
  isLoadingDirection: boolean
}

const BranchSelectionBottomSheet = forwardRef<BottomSheet, BranchSelectionBottomSheetProps>(
  (
    {
      snapPoints,
      animatedIndex,
      animatedPosition,
      appointments,
      isLoadingBranches,
      handleFindNearestBranch,
      nearestBranch,
      showRoute,
      direction,
      isLoadingDirection
    },
    ref
  ) => {
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        animatedPosition={animatedPosition}
        animatedIndex={animatedIndex}
        style={{
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
          overflow: 'hidden'
        }}
        backgroundComponent={({ style }) => (
          <BlurView
            experimentalBlurMethod='dimezisBlurView'
            tint='extraLight'
            intensity={100}
            style={[style, { overflow: 'hidden' }]}
          />
        )}
      >
        <BottomSheetView className='flex-1 px-4 overflow-hidden'>
          {appointments && Array.isArray(appointments) && appointments.length > 0 ? (
            <Text className='font-inter-semibold text-lg mb-4'>Appointment Details</Text>
          ) : isLoadingBranches ? (
            <View className='flex-col mt-8 items-center justify-center gap-2'>
              <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
              <Text className='text-muted-foreground text-sm'>Loading branches...</Text>
            </View>
          ) : (
            <View className='flex-col gap-4 flex-1'>
              <TouchableOpacity
                onPress={handleFindNearestBranch}
                className='flex-1 gap-2 justify-center items-center bg-primary/10 rounded-2xl p-3 flex-row'
                disabled={!nearestBranch || isLoadingBranches}
              >
                {isLoadingBranches ? (
                  <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
                ) : (
                  <MaterialCommunityIcons name='storefront' size={18} color={PRIMARY_COLOR.LIGHT} />
                )}
                <Text className='font-inter-medium text-primary'>
                  {isLoadingBranches ? 'Loading...' : 'Find Nearest Branch'}
                </Text>
              </TouchableOpacity>

              {showRoute && direction && nearestBranch && (
                <View className='gap-3'>
                  <LinearGradient
                    colors={['#5b21b6', '#7c3aed', '#8b5cf6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      boxShadow: '0 0 4px 0 rgba(109, 40, 217, 0.6)'
                    }}
                    className='rounded-2xl p-3 overflow-hidden'
                  >
                    <Text className='font-inter-medium text-white'>Route to {nearestBranch.name}</Text>
                  </LinearGradient>
                </View>
              )}

              {showRoute && isLoadingDirection && (
                <View className='flex-row items-center justify-center gap-2 bg-white/10 rounded-2xl p-4'>
                  <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
                  <Text className='text-white'>Getting directions...</Text>
                </View>
              )}
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    )
  }
)

BranchSelectionBottomSheet.displayName = 'BranchSelectionBottomSheet'

export default BranchSelectionBottomSheet
