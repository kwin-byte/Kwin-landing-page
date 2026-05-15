import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'

/** Thứ tự đồng bộ menu — full-page slide (kiểu okvipci.com) */
export const SECTION_IDS = ['home', 'games', 'promotion', 'statistics', 'news'] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** Hash cũ → id mới */
function hashToSectionId(raw: string): SectionId | null {
  if (raw === 'doi-tac' || raw === 'uu-dai') return 'games'
  if (raw === 'game-show') return 'promotion'
  if (raw === 'uu-dai-vuot-troi') return 'statistics'
  if (raw === 'so-lieu') return 'news'
  const i = SECTION_IDS.indexOf(raw as SectionId)
  return i >= 0 ? (raw as SectionId) : null
}

type SlideNavContextValue = {
  activeIndex: number
  goToSlide: (index: number) => void
  slideCount: number
}

const SlideNavContext = createContext<SlideNavContextValue | null>(null)

const SLIDE_MS = 760
const WHEEL_STRONG = 44
const WHEEL_ACC = 40
const SWIPE_MIN = 56

function panelEl(index: number): HTMLElement | null {
  const id = SECTION_IDS[index]
  return document.getElementById(id)
}

function canScrollPanelDown(el: HTMLElement): boolean {
  return el.scrollTop + el.clientHeight < el.scrollHeight - 2
}

function canScrollPanelUp(el: HTMLElement): boolean {
  return el.scrollTop > 2
}

export function SlideNavProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const lockedRef = useRef(false)
  const accY = useRef(0)
  const lastSign = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  /** Hash trên URL trước paint để tránh nháy slide 0 */
  useLayoutEffect(() => {
    const raw = window.location.hash.slice(1)
    if (!raw) return
    const id = hashToSectionId(raw)
    if (!id) return
    const i = SECTION_IDS.indexOf(id)
    if (i >= 0) {
      activeIndexRef.current = i
      setActiveIndex(i)
      if (raw === 'uu-dai' || raw === 'doi-tac') {
        window.history.replaceState(null, '', '#games')
      }
      if (raw === 'game-show') {
        window.history.replaceState(null, '', '#promotion')
      }
      if (raw === 'uu-dai-vuot-troi') {
        window.history.replaceState(null, '', '#statistics')
      }
      if (raw === 'so-lieu') {
        window.history.replaceState(null, '', '#news')
      }
    }
  }, [])

  /** Khóa cuộn document — chỉ trượt slide */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      document.documentElement.style.overflow = ''
    }
  }, [])

  const goToSlide = useCallback((index: number) => {
    if (lockedRef.current) return
    const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, index))
    if (activeIndexRef.current === clamped) {
      window.history.replaceState(null, '', `#${SECTION_IDS[clamped]}`)
      return
    }
    lockedRef.current = true
    activeIndexRef.current = clamped
    setActiveIndex(clamped)
    window.history.replaceState(null, '', `#${SECTION_IDS[clamped]}`)
    window.setTimeout(() => {
      lockedRef.current = false
    }, SLIDE_MS)
  }, [])

  /** Bánh xe / trackpad */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.15) return

      if (lockedRef.current) {
        e.preventDefault()
        return
      }

      const sign = Math.sign(e.deltaY)
      if (sign !== 0 && lastSign.current !== 0 && sign !== lastSign.current) {
        accY.current = 0
      }
      if (sign !== 0) lastSign.current = sign
      accY.current += e.deltaY

      const lineMode = e.deltaMode === 1
      const pageMode = e.deltaMode === 2
      const strong =
        lineMode ||
        pageMode ||
        Math.abs(e.deltaY) >= WHEEL_STRONG ||
        Math.abs(accY.current) >= WHEEL_ACC

      if (!strong) return

      const idx = activeIndexRef.current
      const panel = panelEl(idx)
      if (!panel) {
        accY.current = 0
        lastSign.current = 0
        return
      }

      const goingDown = accY.current > 0
      accY.current = 0
      lastSign.current = 0

      if (goingDown) {
        if (canScrollPanelDown(panel)) return
        if (idx >= SECTION_IDS.length - 1) return
        e.preventDefault()
        goToSlide(idx + 1)
        return
      }

      if (canScrollPanelUp(panel)) return
      if (idx <= 0) return
      e.preventDefault()
      goToSlide(idx - 1)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [goToSlide])

  /** Đồng bộ khi đổi hash (liên kết ngoài / bookmark) */
  useEffect(() => {
    const onHash = () => {
      const raw = window.location.hash.slice(1)
      if (!raw) return
      const id = hashToSectionId(raw)
      if (!id) return
      const i = SECTION_IDS.indexOf(id)
      if (i >= 0) {
        activeIndexRef.current = i
        setActiveIndex(i)
        if (raw === 'uu-dai' || raw === 'doi-tac') {
          window.history.replaceState(null, '', '#games')
        }
        if (raw === 'game-show') {
          window.history.replaceState(null, '', '#promotion')
        }
        if (raw === 'uu-dai-vuot-troi') {
          window.history.replaceState(null, '', '#statistics')
        }
        if (raw === 'so-lieu') {
          window.history.replaceState(null, '', '#news')
        }
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  /** Phím mũi tên / Page — tương tự cuộn từng slide */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (lockedRef.current) return

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const idx = activeIndexRef.current
        const panel = panelEl(idx)
        if (panel && canScrollPanelDown(panel)) return
        if (idx < SECTION_IDS.length - 1) {
          e.preventDefault()
          goToSlide(idx + 1)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const idx = activeIndexRef.current
        const panel = panelEl(idx)
        if (panel && canScrollPanelUp(panel)) return
        if (idx > 0) {
          e.preventDefault()
          goToSlide(idx - 1)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goToSlide])

  /** Vuốt mobile */
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      touchStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (lockedRef.current) return
      const t = e.changedTouches[0]
      if (!t) return
      const dy = touchStartY.current - t.clientY
      if (Math.abs(dy) < SWIPE_MIN) return

      const idx = activeIndexRef.current
      const panel = panelEl(idx)
      if (!panel) return

      if (dy > 0) {
        if (canScrollPanelDown(panel)) return
        if (idx >= SECTION_IDS.length - 1) return
        goToSlide(idx + 1)
      } else {
        if (canScrollPanelUp(panel)) return
        if (idx <= 0) return
        goToSlide(idx - 1)
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goToSlide])

  const value = useMemo(
    () => ({
      activeIndex,
      goToSlide,
      slideCount: SECTION_IDS.length
    }),
    [activeIndex, goToSlide]
  )

  return <SlideNavContext.Provider value={value}>{children}</SlideNavContext.Provider>
}

export function useSlideNav() {
  const ctx = useContext(SlideNavContext)
  if (!ctx) throw new Error('useSlideNav must be used inside SlideNavProvider')
  return ctx
}
