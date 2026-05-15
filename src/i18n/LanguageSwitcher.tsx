import { useEffect, useId, useRef, useState } from 'react'
import FlagIcon from './FlagIcon'
import { useI18n } from './I18nProvider'
import { LOCALE_LABELS, LOCALE_NAMES, type Locale } from './types'

const LOCALES: Locale[] = ['km', 'vi', 'en']

type Props = {
  className?: string
  compact?: boolean
}

export default function LanguageSwitcher({ className = '', compact = false }: Props) {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const selectLocale = (code: Locale) => {
    setLocale(code)
    setOpen(false)
  }

  const flagClass = compact
    ? 'h-3.5 w-5 shrink-0 rounded-sm ring-1 ring-black/10'
    : 'h-4 w-6 shrink-0 rounded-sm ring-1 ring-black/10'

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className={[
          'flex items-center gap-2 rounded-lg border border-white/15 bg-black/35 text-white shadow-sm backdrop-blur-sm transition',
          'hover:border-orange-400/40 hover:bg-black/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          compact ? 'px-2 py-1.5' : 'px-2.5 py-2'
        ].join(' ')}
        aria-label={t('header.selectLanguage')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <FlagIcon locale={locale} className={flagClass} />
        <span className={compact ? 'text-[10px] font-bold tracking-wide' : 'text-xs font-bold tracking-wide'}>
          {LOCALE_LABELS[locale]}
        </span>
        <svg
          className={[
            'shrink-0 text-white/70 transition-transform',
            compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
            open ? 'rotate-180' : ''
          ].join(' ')}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={t('header.selectLanguage')}
          className="absolute right-0 top-full z-[60] mt-1.5 min-w-[10.5rem] overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 py-1 shadow-xl backdrop-blur-md"
        >
          {LOCALES.map((code) => {
            const selected = locale === code
            return (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[
                    'flex w-full items-center gap-2.5 px-3 py-2 text-left transition',
                    selected
                      ? 'bg-orange-500/15 text-orange-300'
                      : 'text-white/90 hover:bg-white/8 hover:text-white'
                  ].join(' ')}
                  onClick={() => selectLocale(code)}
                >
                  <FlagIcon locale={code} className={flagClass} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold leading-tight">{LOCALE_NAMES[code]}</span>
                    <span className="block text-[10px] text-white/45">{LOCALE_LABELS[code]}</span>
                  </span>
                  {selected && (
                    <svg className="h-4 w-4 shrink-0 text-orange-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 01.006 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414L9 11.586l6.52-6.52a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
