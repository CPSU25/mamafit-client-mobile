import { useQuery } from '@tanstack/react-query'
import orderService from '~/services/order.service'

export const useGetQRCode = (orderId: string) => {
  return useQuery({
    queryKey: ['qr-code', orderId],
    queryFn: () => orderService.getQRCode(orderId)
  })
}
