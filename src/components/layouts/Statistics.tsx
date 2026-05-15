import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { layoutBgImages, layoutSectionStyle } from './layoutBackgrounds'

/** Một viewport, không cuộn trang — nội dung co trong h-dvh */
const statisticsSlideLayout =
  'relative isolate box-border flex h-dvh min-h-0 w-full min-w-0 max-w-full flex-none flex-col overflow-hidden px-3 py-2 sm:px-4 sm:py-3 scroll-animate'

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

type LeaderRow = {
  rank: number
  displayName: string
  winStreak: number
  scoreUsd: number
}

const INITIALS = 'KMPTHABDLNQVGRJWZFCYXSUE'.split('')

const NAME_SUFFIXES = ['VIP', 'pro', '2k', '99', '01', '88', '66', '7', '8', 'ce', 'ic', 'me', 'un', 'x', '3k', '44']

function randomDisplayName(used: Set<string>): string {
  for (let attempt = 0; attempt < 40; attempt++) {
    const a = INITIALS[Math.floor(Math.random() * INITIALS.length)]!
    const useNum = Math.random() < 0.55
    const name = useNum
      ? `${a}***${Math.floor(Math.random() * 90 + 10)}`
      : `${a}***${NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)]}`
    if (!used.has(name)) {
      used.add(name)
      return name
    }
  }
  const fallback = `U***${Math.floor(Math.random() * 90000 + 10000)}`
  used.add(fallback)
  return fallback
}

/** Top 20 ngẫu nhiên, sắp xếp theo tổng thắng (USD, tối đa $500k) giảm dần */
function generateTopPlayers(count = 20): LeaderRow[] {
  const usedNames = new Set<string>()
  const raw = Array.from({ length: count }, () => {
    const minUsd = 50_000
    const maxUsd = 500_000
    const score = minUsd + Math.floor(Math.random() * (maxUsd - minUsd + 1))
    const winStreak = 2 + Math.floor(Math.random() * 15)
    return {
      score,
      displayName: randomDisplayName(usedNames),
      winStreak
    }
  })
  raw.sort((a, b) => b.score - a.score || b.winStreak - a.winStreak)
  return raw.map((r, i) => ({
    rank: i + 1,
    displayName: r.displayName,
    winStreak: r.winStreak,
    scoreUsd: r.score
  }))
}

/** Tốc độ cuộn dọc (px/giây) — đủ chậm để đọc */
const SCROLL_PX_PER_SEC = 22

function streakBarPct(streak: number, maxStreak: number) {
  if (maxStreak <= 0) return 0
  return Math.min(100, Math.round((streak / maxStreak) * 100))
}

function PodiumCard({
  place,
  row,
  variant
}: {
  place: 1 | 2 | 3
  row: LeaderRow
  variant: 'gold' | 'silver' | 'bronze'
}) {
  const { t, formatCurrency } = useI18n()
  const isGold = variant === 'gold'

  const shell =
    variant === 'gold'
      ? 'relative overflow-hidden rounded-[28px] border border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-transparent shadow-[0_0_50px_rgba(255,184,0,0.15)] sm:rounded-[36px]'
      : variant === 'silver'
        ? 'rounded-[28px] border border-white/10 bg-white/[0.03] sm:rounded-[32px]'
        : 'rounded-[28px] border border-amber-700/20 bg-white/[0.03] sm:rounded-[32px]'

  const height = 'shrink-0 py-2 sm:py-3'

  const avatarSize =
    variant === 'gold'
      ? 'h-12 w-12 sm:h-16 sm:w-16'
      : variant === 'silver'
        ? 'h-11 w-11 sm:h-14 sm:w-14'
        : 'h-10 w-10 sm:h-12 sm:w-12'

  const avatarRing =
    variant === 'gold'
      ? 'border-[3px] border-yellow-100 bg-gradient-to-br from-amber-50 via-yellow-200 to-amber-600 shadow-[0_0_22px_rgba(251,191,36,0.55)] ring-2 ring-yellow-200/60 sm:border-[4px] sm:ring-[3px]'
      : variant === 'silver'
        ? 'border-[3px] border-white/90 bg-gradient-to-br from-zinc-50 via-zinc-200 to-zinc-600 shadow-[0_6px_20px_rgba(0,0,0,0.35)] ring-2 ring-white/40 sm:border-[4px]'
        : 'border-[3px] border-amber-200 bg-gradient-to-br from-amber-50 via-amber-300 to-amber-800 shadow-[0_6px_18px_rgba(180,83,9,0.35)] ring-2 ring-amber-300/50 sm:border-[4px]'

  const placeNumClass =
    variant === 'gold'
      ? 'text-[1.125rem] leading-none text-zinc-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.45)] sm:text-[1.65rem]'
      : variant === 'silver'
        ? 'text-base leading-none text-zinc-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.35)] sm:text-2xl'
        : 'text-base leading-none text-amber-950 drop-shadow-[0_1px_0_rgba(255,237,213,0.35)] sm:text-2xl'

  const amountClass =
    variant === 'gold'
      ? 'text-xl font-black text-yellow-300 drop-shadow-[0_0_12px_rgba(255,184,0,0.4)] sm:text-2xl md:text-3xl'
      : variant === 'silver'
        ? 'text-lg font-black text-zinc-100 sm:text-xl'
        : 'text-lg font-black text-amber-400 sm:text-xl'

  return (
    <div
      className={`${shell} ${height} flex w-full flex-col items-center justify-center px-1 text-center backdrop-blur-xl transition sm:px-2`}
    >
      {isGold && (
        <>
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top,rgba(255,184,0,0.2),transparent_55%)]" />
          <div className="absolute right-2 top-2 animate-pulse rounded-full bg-yellow-400 px-2 py-0.5 text-[9px] font-black text-black sm:right-3 sm:top-3 sm:text-[10px]">
            {t('statistics.hotPlayer')}
          </div>
        </>
      )}

      <div className={`relative flex flex-col items-center ${isGold ? 'mb-2 sm:mb-2.5' : 'mb-1.5'}`}>
        {isGold && (
          <div className="absolute -top-5 left-1/2 z-20 -translate-x-1/2 text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:-top-6 sm:text-2xl" aria-hidden>
            👑
          </div>
        )}
        <div
          className={`relative flex shrink-0 items-center justify-center rounded-full ${avatarSize} ${avatarRing}`}
          role="img"
          aria-label={t('statistics.rankAria', { place })}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-white/5 to-black/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-[18%] rounded-full border border-white/25 bg-black/10 shadow-inner sm:inset-[16%]"
            aria-hidden
          />
          <span className={`relative z-10 font-black tabular-nums ${placeNumClass}`} aria-hidden>
            {place}
          </span>
        </div>
      </div>

      <h3 className={`mb-0.5 truncate font-black max-w-full ${isGold ? 'text-sm sm:text-base md:text-lg' : 'text-xs sm:text-sm'}`}>
        {row.displayName}
      </h3>
      <p className={`mb-1 line-clamp-1 text-[10px] sm:mb-1.5 sm:text-xs ${isGold ? 'text-yellow-100/70' : 'text-zinc-400'}`}>
        {isGold
          ? t('statistics.streakLong', { streak: row.winStreak })
          : t('statistics.streakShort', { streak: row.winStreak })}
      </p>
      <div className={`font-mono tabular-nums ${amountClass}`}>{formatCurrency(row.scoreUsd)}</div>
    </div>
  )
}

function LeaderboardRowPremium({
  row,
  streakBarWidthPct
}: {
  row: LeaderRow
  streakBarWidthPct: number
}) {
  const { t, formatCurrency } = useI18n()

  return (
    <li className="group shrink-0 list-none">
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-2.5 py-2 transition-all duration-300 hover:border-yellow-500/30 hover:bg-yellow-500/[0.03] sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-yellow-500/20 bg-zinc-900 text-xs font-black text-yellow-400 sm:h-9 sm:w-9 sm:rounded-xl sm:text-sm">
            {row.rank}
          </div>
          <div
            className="hidden h-8 w-8 shrink-0 rounded-full border border-white/10 bg-gradient-to-br from-zinc-300 to-zinc-700 sm:block sm:h-9 sm:w-9"
            aria-hidden
          />

          <div className="min-w-0 flex-1">
            <h4 className="mb-0.5 truncate text-xs font-bold text-white sm:text-sm">{row.displayName}</h4>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800 sm:h-2 sm:w-28">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-[width] duration-500"
                  style={{ width: `${streakBarWidthPct}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 sm:text-xs">
                {t('statistics.winStreakAbbr', { streak: row.winStreak })}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="font-mono text-sm font-black text-yellow-400 transition group-hover:scale-105 sm:text-base">
            {formatCurrency(row.scoreUsd)}
          </div>
          <p className="text-[9px] text-zinc-500 sm:text-[10px]">{t('statistics.currency')}</p>
        </div>
      </div>
    </li>
  )
}

function rowListPremium(
  rows: LeaderRow[],
  maxStreak: number,
  prefix: string,
  ariaHidden?: boolean
) {
  return (
    <ul className="flex w-full shrink-0 flex-col gap-1.5 sm:gap-2" aria-hidden={ariaHidden || undefined}>
      {rows.map((row) => (
        <LeaderboardRowPremium
          key={`${prefix}-${row.rank}-${row.displayName}`}
          row={row}
          streakBarWidthPct={streakBarPct(row.winStreak, maxStreak)}
        />
      ))}
    </ul>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="group relative flex min-h-[5.25rem] flex-col justify-between gap-2.5 overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-b from-white/[0.09] to-white/[0.025] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_18px_50px_-22px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300 hover:border-yellow-400/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_22px_56px_-18px_rgba(234,179,8,0.12)] sm:min-h-[6rem] sm:gap-3 sm:rounded-3xl sm:p-4 md:min-h-[6.75rem] md:p-5 lg:min-h-28 lg:gap-3.5 lg:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full bg-amber-400/12 blur-3xl transition-opacity group-hover:bg-amber-400/18"
        aria-hidden
      />

      <p className="relative z-[1] line-clamp-2 text-pretty text-[11px] font-medium leading-snug text-zinc-400 sm:text-xs md:text-sm lg:text-[0.95rem] lg:leading-snug">
        {label}
      </p>

      <h3 className="relative z-[1] shrink-0 truncate text-lg font-black tabular-nums leading-none tracking-tight text-yellow-300 drop-shadow-[0_0_22px_rgba(234,179,8,0.32)] sm:text-xl md:text-2xl lg:text-3xl xl:text-[2.125rem]">
        {value}
      </h3>
    </div>
  )
}

export default function Statistics() {
  const { m, t, formatNumber, formatCurrency } = useI18n()
  const [players] = useState<LeaderRow[]>(() => generateTopPlayers())
  const [onlineCount] = useState(() => 25000 + Math.floor(Math.random() * 8000))
  const [winRatePct] = useState(() => 96 + Math.random() * 2.2)

  const top3 = useMemo(() => players.slice(0, 3), [players])
  const rest = useMemo(() => players.slice(3), [players])
  const second = top3[1]
  const first = top3[0]
  const third = top3[2]

  const maxStreakRest = useMemo(
    () => (rest.length ? Math.max(...rest.map((r) => r.winStreak), 1) : 1),
    [rest]
  )

  const totalPrizeUsd = useMemo(() => players.reduce((s, p) => s + p.scoreUsd, 0), [players])
  const statsCards = useMemo(
    () =>
      [
        [m.statistics.stats.totalPrizeToday, formatCurrency(totalPrizeUsd)],
        [m.statistics.stats.playersOnline, formatNumber(onlineCount)],
        [m.statistics.stats.biggestJackpot, first ? formatCurrency(first.scoreUsd) : formatCurrency(0)],
        [m.statistics.stats.winRate, `${winRatePct.toFixed(1)}%`]
      ] as const,
    [m.statistics.stats, totalPrizeUsd, onlineCount, first, winRatePct, formatCurrency, formatNumber]
  )

  const trackRef = useRef<HTMLDivElement>(null)
  const halfPxRef = useRef(0)
  const offsetRef = useRef(0)

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )

  useEffect(() => {
    if (prefersReducedMotion) return

    const el = trackRef.current
    if (!el) return

    offsetRef.current = 0
    el.style.transform = 'translate3d(0,0,0)'

    const measure = () => {
      const kids = el.children
      if (kids.length >= 2) {
        const secondList = kids[1] as HTMLElement
        halfPxRef.current = secondList.offsetTop
      } else {
        const h = el.scrollHeight
        halfPxRef.current = h > 0 ? h / 2 : 0
      }
    }

    measure()
    const ro = new ResizeObserver(() => {
      measure()
      const half = halfPxRef.current
      if (half > 0 && offsetRef.current >= half) offsetRef.current = offsetRef.current % half
    })
    ro.observe(el)

    let raf = 0
    let last = performance.now()

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const half = halfPxRef.current
      if (half > 1) {
        offsetRef.current += SCROLL_PX_PER_SEC * dt
        while (offsetRef.current >= half) offsetRef.current -= half
        el.style.transform = `translate3d(0,${-offsetRef.current}px,0)`
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.style.transform = ''
    }
  }, [prefersReducedMotion, rest])

  return (
    <section
      id="statistics"
      className={`${statisticsSlideLayout} bg-[#070707] text-white`}
      style={layoutSectionStyle(layoutBgImages.statistics)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,184,0,0.16),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,184,0,0.05))] opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />

      <div className="pointer-events-none absolute left-[12%] top-6 h-1.5 w-1.5 rounded-full bg-yellow-400 blur-[1px] animate-pulse sm:top-8" />
      <div className="pointer-events-none absolute right-[15%] top-20 h-1 w-1 rounded-full bg-yellow-300 animate-ping sm:top-24" />
      <div className="pointer-events-none absolute bottom-[12%] left-1/3 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-y-contain">
        <div className="mx-auto flex w-full max-w-7xl shrink-0 flex-col gap-1.5 sm:gap-2">
          <header className="shrink-0 text-center">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[3px] text-yellow-500 sm:text-xs sm:tracking-[4px]">
              {t('statistics.eyebrow')}
            </p>
            <h2 className="text-xl font-black leading-tight sm:text-2xl md:text-3xl">
              {t('statistics.titlePrefix')}{' '}
              <span className="text-yellow-400">{t('statistics.titleHighlight')}</span>
            </h2>
            <p className="mx-auto mt-0.5 line-clamp-1 max-w-2xl text-[10px] text-zinc-400 sm:text-xs">
              {t('statistics.subtitle')}
            </p>
          </header>

          <div className="grid w-full shrink-0 grid-cols-2 items-stretch gap-2.5 sm:gap-3 md:gap-4 lg:grid-cols-4">
            {statsCards.map(([label, value], i) => (
              <StatCard key={i} label={label} value={value} />
            ))}
          </div>

          <div className="grid min-h-0 shrink-0 grid-cols-1 gap-2 md:grid-cols-3 md:items-stretch md:gap-3">
          {first && second && third ? (
            <aside className="flex h-full min-h-0 w-full min-w-0 flex-col">
              <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overscroll-y-contain">
                <div className="w-full shrink-0">
                  <PodiumCard place={1} row={first} variant="gold" />
                </div>
                <div className="w-full shrink-0">
                  <PodiumCard place={2} row={second} variant="silver" />
                </div>
                <div className="w-full shrink-0">
                  <PodiumCard place={3} row={third} variant="bronze" />
                </div>
              </div>
            </aside>
          ) : null}

          <section
            className={`col-span-2 flex h-full max-h-[58dvh] min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-yellow-500/10 bg-black/40 shadow-[0_0_40px_rgba(255,184,0,0.05)] backdrop-blur-xl sm:rounded-3xl ${first && second && third ? '' : 'md:col-span-2'}`}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-yellow-500/10 px-3 py-2 sm:px-4 sm:py-2.5">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black sm:text-base">{t('statistics.leaderboardTitle')}</h3>
                <p className="truncate text-[10px] text-zinc-500 sm:text-xs">{t('statistics.leaderboardPeriod')}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                <span className="text-[10px] text-zinc-400 sm:text-xs">{t('statistics.live')}</span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden p-2 sm:p-2.5">
              {rest.length === 0 ? null : prefersReducedMotion ? (
                <ul className="flex h-full max-h-full flex-col gap-1.5 overflow-y-auto overscroll-y-contain sm:gap-2">
                  {rest.map((row) => (
                    <LeaderboardRowPremium
                      key={`static-${row.rank}-${row.displayName}`}
                      row={row}
                      streakBarWidthPct={streakBarPct(row.winStreak, maxStreakRest)}
                    />
                  ))}
                </ul>
              ) : (
                <div className="h-full min-h-0 overflow-hidden">
                  <div
                    ref={trackRef}
                    className="flex w-full flex-col gap-1.5 will-change-transform sm:gap-2"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {rowListPremium(rest, maxStreakRest, 'a', false)}
                    {rowListPremium(rest, maxStreakRest, 'b', true)}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
        </div>
      </div>
    </section>
  )
}
