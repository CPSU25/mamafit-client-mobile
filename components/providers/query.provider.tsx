import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ErrorResponse } from '~/types/common'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError<ErrorResponse>
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401/403/404 errors
        if (
          error.response?.status === 401 ||
          error.response?.status === 403 ||
          error.response?.status === 404 ||
          error.response?.status === 400
        )
          return false
        return failureCount < 1
      },
      retryDelay: 3000,
      staleTime: 1000 * 60 * 5 // 5 minute
    }
  }
})

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
