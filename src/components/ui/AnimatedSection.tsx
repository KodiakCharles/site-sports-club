'use client'
import { useInView } from '@/hooks/useInView'

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right'
}

export default function AnimatedSection({ children, className = '', delay = 0, animation = 'fade-up' }: Props) {
  const { ref, isInView } = useInView()
  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${animation} ${isInView ? 'in-view' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
