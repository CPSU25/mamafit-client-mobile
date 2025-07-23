import { useQueries } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import contentfulService from '~/services/contentful.service'
import diaryService from '~/services/diary.service'
import orderService from '~/services/order.service'
import userService from '~/services/user.service'
import voucherService from '~/services/voucher.service'

export const useReviewOrderQueries = (userId: string | undefined) => {
  const { user, isAuthenticated } = useAuth()

  return useQueries({
    queries: [
      {
        queryKey: ['addresses-queries', user?.userId],
        queryFn: userService.getAddresses,
        enabled: isAuthenticated
      },
      {
        queryKey: ['profile-queries', userId, user?.userId],
        queryFn: () => userService.getProfile(userId),
        enabled: !!userId && isAuthenticated
      },
      {
        queryKey: ['all-diaries-queries', user?.userId],
        queryFn: () => diaryService.getDiaries(user?.userId ?? '', 1, 100),
        enabled: isAuthenticated
      },
      {
        queryKey: ['branches-queries', user?.userId],
        queryFn: () => orderService.getBranches(),
        enabled: isAuthenticated
      },
      {
        queryKey: ['vouchers-queries', user?.userId],
        queryFn: voucherService.getVouchers,
        enabled: isAuthenticated
      },
      {
        queryKey: ['config-queries', user?.userId],
        queryFn: contentfulService.getConfig,
        enabled: isAuthenticated
      }
    ]
  })
}
