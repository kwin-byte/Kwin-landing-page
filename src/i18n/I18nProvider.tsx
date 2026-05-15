import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { messages } from './locales'
import {
  LOCALE_HTML_LANG,
  LOCALE_INTL,
  type Locale,
  type LocaleMessages
} from './types'

const STORAGE_KEY = 'khmer-win-locale'

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'km') return stored
    // 'vi' tạm ẩn khỏi dropdown — chuyển về km nếu đã lưu vi trước đó
    if (stored === 'vi') return 'km'
  } catch {
    /* ignore */
  }
  return 'km'
}

function getByPath(obj: LocaleMessages, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : undefined
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params[key] ?? ''))
}

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  m: LocaleMessages
  t: (key: string, params?: Record<string, string | number>) => string
  formatNumber: (value: number) => string
  formatCurrency: (value: number) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const m = messages[locale]
  const intlLocale = LOCALE_INTL[locale]

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const raw = getByPath(m, key) ?? key
      return interpolate(raw, params)
    },
    [m]
  )

  const formatNumber = useCallback(
    (value: number) => new Intl.NumberFormat(intlLocale).format(value),
    [intlLocale]
  )

  const formatCurrency = useCallback(
    (value: number) =>
      new Intl.NumberFormat(intlLocale, {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1
      }).format(value),
    [intlLocale]
  )

  useEffect(() => {
    document.documentElement.lang = LOCALE_HTML_LANG[locale]
    document.title = m.meta.title
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (desc) desc.content = m.meta.description
  }, [locale, m.meta.title, m.meta.description])

  const value = useMemo(
    () => ({ locale, setLocale, m, t, formatNumber, formatCurrency }),
    [locale, setLocale, m, t, formatNumber, formatCurrency]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
