// src/context/ScrollContext.tsx
import { createContext, useContext, useRef, useEffect, useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'

type ScrollContextType = {
  saveScrollPosition: (key: string) => void
  restoreScrollPosition: (key: string, force?: boolean) => void
  markNavigationOrigin: (from: 'feed' | 'other') => void
  clearScrollPositions: () => void
  getScrollPosition: (key: string) => number
}

const ScrollContext = createContext<ScrollContextType | null>(null)

// Helper function to safely access sessionStorage
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== 'undefined' ? sessionStorage.getItem(key) : null
    } catch (error) {
      console.warn('sessionStorage access failed:', error)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, value)
      }
    } catch (error) {
      console.warn('sessionStorage access failed:', error)
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key)
      }
    } catch (error) {
      console.warn('sessionStorage access failed:', error)
    }
  }
}

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollPositions = useRef<Record<string, number>>({})
  const navigationOrigin = useRef<'feed' | 'other'>('other')
  const isRestoring = useRef(false)
  const location = useLocation()
  const [isReady, setIsReady] = useState(false)

  // Load scroll positions from sessionStorage on mount
  useEffect(() => {
    const loadScrollPositions = () => {
      try {
        const saved = safeSessionStorage.getItem('scrollPositions')
        if (saved) {
          scrollPositions.current = JSON.parse(saved)
        }
        setIsReady(true)
      } catch (error) {
        console.warn('Failed to load scroll positions from sessionStorage', error)
        setIsReady(true)
      }
    }

    loadScrollPositions()
  }, [])

  // Save scroll positions to sessionStorage when they change
  useEffect(() => {
    if (isReady) {
      safeSessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.current))
    }
  }, [scrollPositions.current, isReady])

  const saveScrollPosition = useCallback((key: string) => {
    if (isRestoring.current || typeof window === 'undefined') return
    
    scrollPositions.current[key] = window.scrollY
    navigationOrigin.current = 'feed'
    
    // Immediately persist to sessionStorage
    safeSessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.current))
  }, [])

  const restoreScrollPosition = useCallback((key: string, force = false) => {
    if ((isRestoring.current && !force) || !isReady || typeof window === 'undefined') return
    
    const position = scrollPositions.current[key]
    if (position !== undefined && position > 0) {
      isRestoring.current = true
      
      const attemptScroll = (attempts = 5) => {
        if (attempts <= 0) {
          isRestoring.current = false
          return
        }
        
        // Use multiple methods for cross-browser compatibility
        window.scrollTo({ top: position, behavior: 'auto' })
        document.documentElement.scrollTop = position
        document.body.scrollTop = position
        
        // Verify restoration with a small delay to allow DOM updates
        setTimeout(() => {
          const currentPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
          
          if (Math.abs(currentPosition - position) > 10 && attempts > 0) {
            attemptScroll(attempts - 1)
          } else {
            isRestoring.current = false
          }
        }, 200)
      }
      
      attemptScroll()
    }
  }, [isReady])

  const markNavigationOrigin = useCallback((from: 'feed' | 'other') => {
    navigationOrigin.current = from
  }, [])

  const clearScrollPositions = useCallback(() => {
    scrollPositions.current = {}
    safeSessionStorage.removeItem('scrollPositions')
  }, [])

  const getScrollPosition = useCallback((key: string): number => {
    return scrollPositions.current[key] || 0
  }, [])

  // Reset restoring flag when location changes
  useEffect(() => {
    isRestoring.current = false
  }, [location.pathname])

  return (
    <ScrollContext.Provider 
      value={{ 
        saveScrollPosition, 
        restoreScrollPosition,
        markNavigationOrigin,
        clearScrollPositions,
        getScrollPosition
      }}
    >
      {children}
    </ScrollContext.Provider>
  )
}

export const useScroll = () => {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider')
  }
  return context
}