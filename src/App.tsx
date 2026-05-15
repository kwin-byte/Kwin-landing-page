import { useEffect, useRef } from 'react'
import Header from './components/Header'
import Promotion from './components/layouts/Promotion'
import Statistics from './components/layouts/Statistics'
import News from './components/layouts/News'
import Home from './components/layouts/Home'
import Games from './components/layouts/Games'
import { SECTION_IDS, SlideNavProvider, useSlideNav } from './context/SlideNavContext'
import './App.css'

function SlideStack() {
  const { activeIndex } = useSlideNav()

  return (
    <main className="absolute inset-0 z-0 h-dvh w-full overflow-hidden">
      <div
        className="flex w-full flex-col will-change-transform transition-[transform] duration-[720ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          height: `calc(${SECTION_IDS.length} * 100dvh)`,
          transform: `translate3d(0, calc(-1 * ${activeIndex} * 100dvh), 0)`
        }}
      >
        <Home />
        <Games />
        <Promotion />
        <Statistics />
        <News />
      </div>
    </main>
  )
}

function AppLayout() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-animate')
      elements.forEach((el) => observerRef.current?.observe(el))
    }

    observeElements()

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 min-w-0 max-w-full overflow-hidden bg-zinc-950">
      <div className="parallax-bg" />

      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <SlideStack />
      <Header />
    </div>
  )
}

export default function App() {
  return (
    <SlideNavProvider>
      <AppLayout />
    </SlideNavProvider>
  )
}
