import { useQueries } from '@tanstack/react-query'
import * as Location from 'expo-location'
import { useMemo } from 'react'
import { useAuth } from '~/hooks/use-auth'
import goongService from '~/services/goong.service'
import { Vehicle } from '~/types/common'
import { Branch, BranchWithDirection } from '~/types/order.type'

export const useGetBranchesWithDirections = (
  userLocation: Location.LocationObject | null,
  branches: Branch[] | undefined,
  vehicle: Vehicle = Vehicle.Bike
) => {
  const { user, isAuthenticated } = useAuth()

  const branchQueries = useQueries({
    queries:
      branches && userLocation && isAuthenticated
        ? branches.map((branch) => ({
            queryKey: [
              'direction',
              `${userLocation.coords.latitude},${userLocation.coords.longitude}`,
              `${branch.latitude},${branch.longitude}`,
              vehicle,
              user?.userId
            ],
            queryFn: () =>
              goongService.getDirection(
                `${userLocation.coords.latitude},${userLocation.coords.longitude}`,
                `${branch.latitude},${branch.longitude}`,
                vehicle
              ),
            enabled: true,
            staleTime: 24 * 60 * 60 * 1000 // 24 hours
          }))
        : []
  })

  const branchesWithDirections = useMemo((): BranchWithDirection[] => {
    if (!branches || !userLocation || branchQueries.length === 0) {
      return []
    }

    return branches
      .map((branch, index) => {
        const query = branchQueries[index]
        const directionData = query.data

        let distance = 0
        let duration = 0

        if (directionData?.routes?.[0]) {
          distance = directionData.routes[0].legs[0]?.distance?.value || 0
          duration = directionData.routes[0].legs[0]?.duration?.value || 0
        }

        return {
          ...branch,
          distance: distance / 1000, // Convert to kilometers
          duration: duration / 60, // Convert to minutes
          directionData
        }
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0)) // Sort by distance
  }, [branches, userLocation, branchQueries])

  const isLoading = branchQueries.some((query) => query.isLoading)
  const isError = branchQueries.some((query) => query.isError)

  return {
    branchesWithDirections,
    isLoading,
    isError
  }
}
