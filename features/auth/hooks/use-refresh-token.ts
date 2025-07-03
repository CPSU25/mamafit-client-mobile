import { useMutation } from '@tanstack/react-query'
import authService from '~/services/auth.service'

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authService.refreshToken
  })
}
