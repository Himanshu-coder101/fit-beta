import '../styles/globals.css'
import { useEffect } from 'react'

function setInitialTheme() {
  const saved = typeof window !== 'undefined' && localStorage.getItem('ft_theme')
  if (saved) {
    document.documentElement.classList.toggle('dark', saved === 'dark')
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', prefersDark)
  }
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    setInitialTheme()
  }, [])
  return <Component {...pageProps} />
}
