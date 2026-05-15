export type Locale = 'vi' | 'en' | 'km'

export type PromotionItem = {
  title: string
  description: string
}

export type NewsListItem = {
  date: string
  title: string
  comments: number
}

export type LocaleMessages = {
  meta: {
    title: string
    description: string
  }
  nav: {
    home: string
    games: string
    promotion: string
    statistics: string
    news: string
  }
  header: {
    logoAlt: string
    backToTop: string
    mainNav: string
    playNow: string
    downloadApp: string
    openMenu: string
    closeMenu: string
    selectLanguage: string
  }
  home: {
    logoAlt: string
    headline: string
    tagline: string
  }
  games: {
    eyebrow: string
    title: string
    subtitle: string
  }
  partners: {
    openSite: string
  }
  promotion: {
    sectionTitle: string
    items: PromotionItem[]
  }
  statistics: {
    eyebrow: string
    titlePrefix: string
    titleHighlight: string
    subtitle: string
    stats: {
      totalPrizeToday: string
      playersOnline: string
      biggestJackpot: string
      winRate: string
    }
    hotPlayer: string
    rankAria: string
    streakLong: string
    streakShort: string
    winStreakAbbr: string
    currency: string
    leaderboardTitle: string
    leaderboardPeriod: string
    live: string
  }
  news: {
    eyebrow: string
    title: string
    comments: string
    list: NewsListItem[]
    featured: {
      category: string
      title: string
      description: string
      date: string
      commentsCount: number
    }
  }
}

export const LOCALE_LABELS: Record<Locale, string> = {
  vi: 'VI',
  en: 'EN',
  km: 'KM'
}

export const LOCALE_NAMES: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  km: 'ភាសាខ្មែរ'
}

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  vi: 'vi',
  en: 'en',
  km: 'km'
}

export const LOCALE_INTL: Record<Locale, string> = {
  vi: 'vi-VN',
  en: 'en-US',
  km: 'km-KH'
}
