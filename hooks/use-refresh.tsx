import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { useCallback, useState } from 'react'
import { Alert, RefreshControl } from 'react-native'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

type RefetchFunction = (options?: RefetchOptions) => Promise<QueryObserverResult>

interface UseRefreshOptions {
  /** Show error alerts when refresh fails */
  showErrorAlert?: boolean
  /** Enable haptic feedback */
  enableHaptics?: boolean
  /** Custom tint color for the refresh control */
  tintColor?: string
  /** Custom title for the refresh control */
  title?: string
  /** Minimum refresh duration in ms */
  minRefreshDuration?: number
}

export function useRefreshs(refetchFunctions: RefetchFunction[], options: UseRefreshOptions = {}) {
  const {
    showErrorAlert = true,
    enableHaptics = true,
    tintColor = PRIMARY_COLOR.LIGHT,
    title,
    minRefreshDuration = 500
  } = options

  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      setError(null)

      if (enableHaptics) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }

      const startTime = Date.now()
      const results = await Promise.allSettled(refetchFunctions.map((refetch) => refetch()))
      const failures = results.filter((result) => result.status === 'rejected')

      if (failures.length > 0) {
        const errorMsg = 'Failed to refresh some data'
        setError(errorMsg)

        if (showErrorAlert) {
          Alert.alert('Refresh Error', errorMsg, [{ text: 'OK' }])
        }

        if (enableHaptics) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        }
      } else {
        if (enableHaptics) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }
      }

      const elapsed = Date.now() - startTime
      if (elapsed < minRefreshDuration) {
        await new Promise((resolve) => setTimeout(resolve, minRefreshDuration - elapsed))
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to refresh'
      setError(errorMsg)

      if (showErrorAlert) {
        Alert.alert('Refresh Error', errorMsg, [{ text: 'OK' }])
      }

      if (enableHaptics) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      }
    } finally {
      setRefreshing(false)
    }
  }, [refetchFunctions, showErrorAlert, enableHaptics, minRefreshDuration])

  return {
    refreshing,
    error,
    refreshControl: (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={tintColor}
        colors={[tintColor]}
        title={title}
        titleColor={tintColor}
      />
    )
  }
}
