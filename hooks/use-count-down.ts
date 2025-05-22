import { useCallback, useEffect, useRef, useState } from 'react'

interface UseCountDownOptions {
  seconds: number
  autoStart?: boolean
}

export const useCountDown = ({ seconds, autoStart = true }: UseCountDownOptions) => {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [isActive, setIsActive] = useState(autoStart)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    clearTimer()
    setTimeLeft(seconds)
    setIsActive(true)
  }, [seconds, clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setTimeLeft(seconds)
    setIsActive(false)
  }, [seconds, clearTimer])

  useEffect(() => {
    if (!isActive) {
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          clearTimer()
          setIsActive(false)
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearTimer()
  }, [isActive, clearTimer])

  return {
    timeLeft,
    isReady: timeLeft === 0,
    start,
    reset
  }
}
