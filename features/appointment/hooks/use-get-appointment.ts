import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import appointmentService from '~/services/appointment.service'

export const useGetAppointment = (appointmentId: string) => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['appointment', appointmentId, user?.userId],
    queryFn: () => appointmentService.getAppointment(appointmentId),
    enabled: isAuthenticated
  })
}
