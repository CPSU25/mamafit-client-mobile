import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { RefreshControl } from 'react-native'

type RefetchFunction = (options?: RefetchOptions) => Promise<QueryObserverResult>

export function useRefreshs(refetchFunctions: RefetchFunction[]) {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all(refetchFunctions.map((refetch) => refetch())) // Run all refetch functions
    setRefreshing(false)
  }, [refetchFunctions])

  return {
    refreshing,
    refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
}
