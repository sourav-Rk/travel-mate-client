"use client"

import { useState, useEffect, useCallback } from "react"

const TIMER_DURATION = 60 // 60 seconds
const STORAGE_KEY = "otp-timer-start"

export function useOtpTimer() {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [isActive, setIsActive] = useState(false)

  const startTimer = useCallback(() => {
    const startTime = Date.now()
    localStorage.setItem(STORAGE_KEY, startTime.toString())
    setTimeLeft(TIMER_DURATION) // Add this line to reset the timer
    setIsActive(true)
  }, [])

  const resetTimer = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setTimeLeft(TIMER_DURATION)
    setIsActive(false)
  }, [])

  useEffect(() => {
    // Check if there's an existing timer on mount
    const savedStartTime = localStorage.getItem(STORAGE_KEY)
    if (savedStartTime) {
      const startTime = Number.parseInt(savedStartTime)
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = Math.max(0, TIMER_DURATION - elapsed)

      if (remaining > 0) {
        setTimeLeft(remaining)
        setIsActive(true)
      } else {
        resetTimer()
      }
    } else {
      // No existing timer, start a new one (simulating OTP just sent)
      startTimer()
    }
  }, [resetTimer, startTimer])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false)
            localStorage.removeItem(STORAGE_KEY)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  return {
    timeLeft,
    isActive,
    canResend: !isActive && timeLeft === 0,
    startTimer,
    resetTimer,
    formatTime: (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    },
  }
}
