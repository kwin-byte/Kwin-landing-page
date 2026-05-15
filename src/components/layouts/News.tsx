import { fullLayout } from './fullLayout'
import { layoutBgImages, layoutSectionStyle } from './layoutBackgrounds'
import bonusData1 from '../../assets/images/imageBonus/bonusData1.jpg'
import bonusData2 from '../../assets/images/imageBonus/bonusData2.jpg'
import bonusData3 from '../../assets/images/imageBonus/bonusData3.jpg'
import bonusData4 from '../../assets/images/imageBonus/bonusData4.jpg'

type ListItem = {
  image: string
  date: string
  comments: number
  title: string
}

const LIST_NEWS: ListItem[] = [
  {
    image: bonusData2,
    date: '9 tháng 12, 2025',
    comments: 8,
    title: 'Cách thăng hạng VIP và nhận ưu đãi độc quyền mỗi tuần'
  },
  {
    image: bonusData3,
    date: '5 tháng 12, 2025',
    comments: 3,
    title: 'Hướng dẫn nạp rút an toàn và xử lý giao dịch trong vài phút'
  },
  {
    image: bonusData4,
    date: '1 tháng 12, 2025',
    comments: 0,
    title: 'Tổng hợp sự kiện thưởng nóng: đua top, vòng quay may mắn'
  }
]

const FEATURED = {
  image: bonusData1,
  category: 'Trực tuyến',
  title: 'Giải trí trực tuyến như một trải nghiệm nghệ thuật — tham gia giải đấu mùa mới',
  description:
    'Khám phá không gian chơi được thiết kế tỉ mỉ, từ giao diện đến âm thanh, mang lại cảm giác như đang tham dự một sự kiện đỉnh cao. Đăng ký hôm nay để nhận gói quà chào mừng và vé tham dự các giải đấu dành riêng cho hội viên.',
  meta: '5 tháng 12, 2025 • 0 bình luận'
}

export default function News() {
  return (
    <section
      id="news"
      className={`${fullLayout} relative py-16`}
      style={layoutSectionStyle(layoutBgImages.news)}
    >
      <div className="container relative z-10 mx-auto w-full min-w-0 max-w-[1200px] px-4 sm:px-6">
        <header className="mb-10 text-center sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Tin tức</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">Bài viết giải trí</h2>
        </header>

        <div className="grid min-h-0 grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          {/* Cột trái — 5/12 */}
          <div className="flex min-h-0 flex-col lg:col-span-5 lg:h-full">
            <ul className="flex flex-col gap-3 sm:gap-4">
              {LIST_NEWS.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-row items-center gap-4 rounded-2xl border border-zinc-600/50 bg-zinc-950/55 px-4 py-4 text-left shadow-lg backdrop-blur-md sm:px-5 sm:py-5"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-zinc-600/60">
                    <img
                      src={item.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-left text-xs text-zinc-500">
                      {item.date}
                      <span className="text-zinc-600"> · </span>
                      {item.comments} bình luận
                    </p>
                    <h3 className="mt-2 text-left text-base font-bold leading-snug text-white sm:text-lg">{item.title}</h3>
                  </div>
                </li>
              ))}
            </ul>
            <div className="hidden min-h-0 flex-1 lg:block" aria-hidden />
          </div>

          {/* Cột phải — 7/12 */}
          <article className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-950/80 shadow-xl backdrop-blur-md lg:col-span-7 lg:h-full lg:min-h-0">
            <div className="grid h-full min-h-0 flex-1 grid-cols-1 lg:grid-cols-2 lg:items-stretch">
              <div className="relative min-h-[220px] bg-zinc-800 lg:h-full lg:min-h-0">
                <img
                  src={FEATURED.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="flex min-h-0 flex-col justify-center gap-4 p-6 sm:p-8">
                <span className="w-fit rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {FEATURED.category}
                </span>
                <h3 className="text-left text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[1.75rem] lg:leading-snug">
                  {FEATURED.title}
                </h3>
                <p className="line-clamp-3 text-left text-sm leading-relaxed text-zinc-400 sm:text-base">
                  {FEATURED.description}
                </p>
                <hr className="border-zinc-700/90" />
                <p className="text-left text-xs text-zinc-500 sm:text-sm">{FEATURED.meta}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
