import type { CSSProperties } from 'react'
import backgroundAlt from '../../assets/images/bg-1.CGVAhYbT.avif'
import backgroundLayout2 from '../../assets/images/Bg2.png'
import bgNews from '../../assets/images/Bg3.jpg'
import bgWinner from '../../assets/images/bgWinner.jpg'
import bgBonus from '../../assets/images/imageBonus/Bg_Bonus.jpg'

/** Ảnh nền theo layout */
export const layoutBgImages = {
  hero: backgroundAlt,
  /** Slide Games (marquee, `#games`) — Bg2 */
  partners: backgroundLayout2,
  /** Slide Promotion (`#promotion`) — Bg_Bonus */
  promotion: bgBonus,
  /** Slide Statistics (`#statistics`) — bgWinner */
  statistics: bgWinner,
  /** Slide News (`#news`) — Bg3 */
  news: bgNews
} as const

export function layoutSectionStyle(imageSrc: string): CSSProperties {
  return {
    backgroundImage: `url(${imageSrc})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
}
