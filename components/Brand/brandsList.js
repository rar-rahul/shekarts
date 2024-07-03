import { A11y, Autoplay } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Brand from "./brands";
import c from "./brand.module.css";
import { useTranslation } from "react-i18next";

const breakpointNewArrival = {
  320: {
    slidesPerView: 2,
  },
  480: {
    slidesPerView: 3,
  },
  600: {
    slidesPerView: 4,
  },
  991: {
    slidesPerView: 5,
  },
  1200: {
    slidesPerView: 7,
  },
};

function BrandsList(items) {
  const { t } = useTranslation();
  console.log(items)

  // if (!items || !items.length) {
  //   return null;
  // }

  return (
    <div className="content_container">
      <div className="custom_container">
        <h2 className="content_heading">{t("top_brands")}</h2>
        <div className={c.root_container}>
          <Swiper
            modules={[A11y, Autoplay]}
            spaceBetween={0}
            slidesPerView="auto"
            breakpoints={breakpointNewArrival}
            className={`_feature_slider ${c.root_container}`}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            loop={false}
            centeredSlides={false}
            centerInsufficientSlides={true}
            speed={500}
          >
            
             {items?.items.map((item, index) => (
                <SwiperSlide key={item._id}>
                  <Brand
                    name={item.name}
                    slug={item.slug}
                    img={item.image[0]?.url}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default BrandsList;
