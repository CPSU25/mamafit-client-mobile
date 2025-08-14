import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import appointmentService from '~/services/appointment.service'

export const useGetAvailableSlots = (branchId: string, date: string) => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['available-slots', branchId, date, user?.userId],
    queryFn: () => appointmentService.getAvailableSlots(branchId, date),
    enabled: isAuthenticated && !!branchId && !!date
  })
}
