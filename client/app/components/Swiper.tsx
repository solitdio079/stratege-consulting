import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import heroBg1 from "../images/hero2.png";
import heroBg2 from "../images/hero2.png";
import heroBg4 from "../images/hero2.png";
import HeroSlider from "./HeroSlider";
import { Link } from "react-router";

export default function SwiperComponent() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{
          el: "#containerForBullets",
          type: "bullets",
          bulletClass: "swiper-custom-bullet",
          bulletActiveClass: "swiper-custom-bullet-active",
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <div
          id="containerForBullets"
          className="flex justify-center gap-3"
        ></div>
        <SwiperSlide>
          <HeroSlider heroBg={heroBg4}>
          
              <h1 className="text-white intersect:motion-preset-slide-right intersect:motion-delay-[400ms] intersect:motion-ease-spring-bouncier relative z-1 text-5xl leading-[1.15] font-bold max-md:text-4xl md:max-w-3xl md:text-balance">
                <span className="text-primary">Stratège Consulting Mali</span>
              </h1>
              <p className="text-white p-1 text-lg max-w-3xl intersect:motion-preset-slide-right intersect:motion-delay-[600ms] intersect:motion-ease-spring-bouncier">
                Nous transformons vos défis fiscaux et stratégiques en leviers
                de croissance
              </p>

              <Link
                to="/about"
                className="btn btn-primary animate-bounce btn-gradient btn-lg intersect:motion-preset-slide-right intersect:motion-delay-[800ms] intersect:motion-ease-spring-bouncier"
              >
                Prendre rendez-vous
                <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
              </Link>
           
          </HeroSlider>
        </SwiperSlide>
       
       
      </Swiper>
    </>
  );
}
