'use client'
import { useInView } from '@/hooks/useInView'
import { useEffect, useState } from 'react'

export default function CountUp({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const { ref, isInView } = useInView()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return <span ref={ref}>{isInView ? count : 0}{suffix}</span>
}
