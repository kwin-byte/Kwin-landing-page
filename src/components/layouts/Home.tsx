import { fullLayout } from './fullLayout'
import { layoutBgImages, layoutSectionStyle } from './layoutBackgrounds'
import logo from '../../assets/images/logo.png'

export default function Home() {
  return (
    <section
      id="home"
      className={`${fullLayout} !pt-28 pb-12`}
      style={layoutSectionStyle(layoutBgImages.hero)}
    >
      <div className="container relative z-10 mx-auto w-full min-w-0 max-w-[1200px]">
        <div className="w-full max-w-4xl lg:w-1/2 text-left">
          <div className="mb-0 animate-fade-in-up">
            <img
              src={logo}
              alt="Khmer Win"
              className="h-auto w-48 sm:w-56 md:w-64 lg:w-72"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white -mt-6 mb-8 animate-fade-in-up text-reveal">
            <span>HÔM NAY 1 TỶ, NGÀY MAI 1000 TỶ!</span>
          </h2>
          <p className="text-xl text-yellow-200 mb-8 max-w-3xl animate-fade-in-up">
            Khmer Win tự hào mang tới hệ thống Game show hoàn toàn miễn phí, đa dạng, hấp dẫn, tặng thưởng giá trị cao!
          </p>
        </div>
      </div>
    </section>
  )
}
