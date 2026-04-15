'use client'
import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)
    setDark(isDark)
    document.documentElement.classList.toggle('dark-mode', isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark-mode', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="btn-icon dark-mode-toggle"
      aria-label={dark ? 'Mode jour' : 'Mode nuit'}
      title={dark ? 'Mode jour' : 'Mode nuit'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
