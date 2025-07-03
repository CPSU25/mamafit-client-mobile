import React from 'react'
import { useSignalR } from '~/hooks/use-signalr'

export default function SignalRProvider({ children }: { children: React.ReactNode }) {
  useSignalR()

  return <>{children}</>
}
