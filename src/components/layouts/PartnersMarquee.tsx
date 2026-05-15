import { useMemo, useSyncExternalStore, type CSSProperties } from 'react'
import { useI18n } from '../../i18n/I18nProvider'

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionServerSnapshot() {
  return false
}

type Props = {
  images: string[]
  speed?: number
}

function duplicateForLoop(urls: string[]) {
  return [...urls, ...urls]
}

/** 7 ô; 6 khe × 24px = 144px */
const SLOT_W = 'w-[calc((100cqw-144px-1px)/7)] md:w-[calc((100cqw-144px-1px)/7)]' as const

const TRACK_GAP = 'gap-[24px]' as const

const SHELL_PAD = 'py-1 md:py-2' as const

const PARTNER_URL = 'https://khmerwin.vip/'

export default function PartnersMarquee({ images, speed }: Props) {
  const { t } = useI18n()
  const row = images
  const track = useMemo(() => duplicateForLoop(row), [row])

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )

  if (images.length === 0) return null

  const sp = speed ?? 40
  const durationSec = Math.min(68, Math.max(26, 16 + row.length * 2.1 + 900 / sp))

  const cell = (src: string, i: number, prefix: string) => (
    <div
      key={`${prefix}-${src}-${i}`}
      className={`partners-marquee-cell relative min-w-0 shrink-0 ${SLOT_W}`}
    >
      <a
        href={PARTNER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="partners-marquee-cell__link group/pm block w-full min-w-0 rounded-2xl outline-none transition-[box-shadow,transform] duration-200 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        aria-label={t('partners.openSite')}
      >
        <div className="partners-marquee-cell__frame relative box-border flex w-full min-w-0 overflow-hidden rounded-2xl bg-black/15 ring-1 ring-white/10 transition-[box-shadow,transform,background-color] duration-200 group-hover/pm:scale-[1.02] group-hover/pm:bg-black/35 group-hover/pm:shadow-[0_0_0_1px_rgba(251,191,36,0.45),0_10px_28px_rgba(0,0,0,0.45)] group-hover/pm:ring-orange-400/50">
          <img
            src={src}
            alt=""
            className="partners-logo-img partners-marquee-cell__img box-border block h-auto w-full min-w-0 max-w-full object-contain object-center transition-[transform,filter,opacity] duration-200 group-hover/pm:scale-[1.06] group-hover/pm:brightness-110"
            loading={i < 10 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        </div>
      </a>
    </div>
  )

  if (prefersReducedMotion) {
    return (
      <div className={`@container partners-ticker-shell box-border w-full min-w-0 ${SHELL_PAD}`}>
        <div className="flex w-full flex-wrap items-end justify-center gap-[24px]">
          {row.map((src, i) => cell(src, i, 'static'))}
        </div>
      </div>
    )
  }

  return (
    <div className={`@container partners-ticker-shell box-border w-full min-w-0 ${SHELL_PAD}`}>
      <div className="w-full min-w-0 overflow-x-hidden overflow-y-visible">
        <div
          className={`partners-marquee-track partners-marquee-track--left flex w-max items-end ${TRACK_GAP}`}
          style={{ '--partners-dur': `${durationSec}s` } as CSSProperties}
        >
          {track.map((src, i) => cell(src, i, 'm'))}
        </div>
      </div>
    </div>
  )
}
