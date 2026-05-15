import type { Locale } from './types'

type Props = {
  locale: Locale
  className?: string
}

export default function FlagIcon({ locale, className = 'h-4 w-6 shrink-0 rounded-sm shadow-sm ring-1 ring-black/10' }: Props) {
  switch (locale) {
    case 'vi':
      return (
        <svg className={className} viewBox="0 0 30 20" aria-hidden>
          <rect width="30" height="20" fill="#DA251D" />
          <polygon
            fill="#FFCD00"
            points="15,3.2 17.35,9.1 23.6,9.1 18.45,12.7 20.5,18.6 15,15.1 9.5,18.6 11.55,12.7 6.4,9.1 12.65,9.1"
          />
        </svg>
      )
    case 'en':
      return (
        <svg className={className} viewBox="0 0 30 20" aria-hidden>
          <rect width="30" height="20" fill="#B22234" />
          <path
            fill="#fff"
            d="M0 1.54h30M0 4.62h30M0 7.69h30M0 10.77h30M0 13.85h30M0 16.92h30"
            stroke="#fff"
            strokeWidth="1.54"
          />
          <rect width="12" height="10.77" fill="#3C3B6E" />
          <g fill="#fff">
            <circle cx="2" cy="1.5" r="0.55" />
            <circle cx="5" cy="1.5" r="0.55" />
            <circle cx="8" cy="1.5" r="0.55" />
            <circle cx="11" cy="1.5" r="0.55" />
            <circle cx="3.5" cy="3.2" r="0.55" />
            <circle cx="6.5" cy="3.2" r="0.55" />
            <circle cx="9.5" cy="3.2" r="0.55" />
            <circle cx="2" cy="5" r="0.55" />
            <circle cx="5" cy="5" r="0.55" />
            <circle cx="8" cy="5" r="0.55" />
            <circle cx="11" cy="5" r="0.55" />
            <circle cx="3.5" cy="6.7" r="0.55" />
            <circle cx="6.5" cy="6.7" r="0.55" />
            <circle cx="9.5" cy="6.7" r="0.55" />
            <circle cx="2" cy="8.5" r="0.55" />
            <circle cx="5" cy="8.5" r="0.55" />
            <circle cx="8" cy="8.5" r="0.55" />
            <circle cx="11" cy="8.5" r="0.55" />
          </g>
        </svg>
      )
    case 'km':
      return (
        <svg className={className} viewBox="0 0 30 20" aria-hidden>
          <rect width="30" height="4.5" y="0" fill="#032EA1" />
          <rect width="30" height="11" y="4.5" fill="#E00025" />
          <rect width="30" height="4.5" y="15.5" fill="#032EA1" />
          <path
            fill="#fff"
            d="M15 6.2c-2.2 0-4 1.5-4.6 3.6.8-.5 1.7-.8 2.7-.8 2.5 0 4.5 1.6 5.3 3.8-.3-2.2-2.2-3.9-4.5-4.2.4-.9 1.3-1.5 2.4-1.5 1.6 0 2.9 1.2 3.1 2.8-.5-1.8-2.2-3.1-4.4-3.1z"
          />
          <path fill="#fff" d="M11.2 12.2h7.6v1.2h-7.6zm0 1.8h7.6v.9h-7.6z" opacity="0.95" />
        </svg>
      )
    default:
      return null
  }
}
