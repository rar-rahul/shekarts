import { CaretLeft, CaretRight } from "@styled-icons/bootstrap";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { A11y, Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Product from "../Shop/Product/product";
import c from "./productList.module.css";
import useOnScreen from "~/utils/useOnScreen";
import { toast } from "react-toastify";
import { fetchData } from "~/lib/clientFunctions";
import Spinner from "../Ui/Spinner";
import useSWR from "swr"

const breakpointNewArrival = {
  320: {
    slidesPerView: 2,
  },
  675: {
    slidesPerView: 3,
  },
  880: {
    slidesPerView: 4,
  },
  1100: {
    slidesPerView: 5,
  },
  1600: {
    slidesPerView: 6,
  },
};

const fetcher = (url) => fetch(url).then((res) => res.json());

function ProductList(props) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [loaded, setLoaded] = useState(false);
  //const [productList, setProductList] = useState([]);
  const current = useRef();
  const onViewPort = useOnScreen(current);
  //pagination logic here
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useSWR(`/api/home/products?type=${props.type}&page=${page}&limit=8`, fetcher, {
    keepPreviousData: true, // keeps last batch while fetching next
    revalidateOnFocus: false,
  revalidateOnReconnect: false,
  });

  const products = data?.products || [];
  const hasMore = products.length === 8 ? 1 : 0; // to check if more data available

  if (error) toast.error("Something went wrong");

  console.log("useswr",data);

  // async function loadData() {
  //   try {
  //     const url = `/api/home/products?type=${props.type}&page=${page}&limit=8`;
  //     const resp = await fetchData(url);
  //     resp.success
  //       ? setProductList(resp.products || [])
  //       : toast.error("Something Went Wrong");
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Something Went Wrong");
  //   }
  //   setLoaded(true);
  // }

  // async function loadData() {
  //   try {
  //     data.success
  //       ? setProductList(data.products || [])
  //       : toast.error("Something Went Wrong");
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Something Went Wrong");
  //   }
  //   setLoaded(true);
  // }

  // useEffect(() => {
  //   if (onViewPort && !loaded) {
  //     loadData();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [onViewPort]);

  return (
    <div className="content_container" ref={current}>
      <div className="custom_container">
        <h2 className="content_heading">{props.title}</h2>
        {isLoading && (
          <div className={c.loader}>
            <Spinner />
          </div>
        )}
        {products.length > 0 && (
          <div className="navigation-wrapper">
            <Swiper
              modules={[Navigation, A11y, Autoplay]}
              spaceBetween={0}
              slidesPerView="auto"
              navigation={{ prevEl, nextEl }}
              breakpoints={breakpointNewArrival}
              className="_feature_slider"
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                waitForTransition: true,
              }}
              loop={false}
              centeredSlides={false}
              centerInsufficientSlides={true}
              speed={900}
            >
              {products.map((item) => (
                <SwiperSlide key={item._id} className={c.container}>
                  <Product
                    product={item}
                    button
                    link={`/?slug=${item.slug}`}
                    layout={"text-start"}
                    border
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div
              className="swiper-button-prev arrow arrow--left"
              ref={(node) => setPrevEl(node)}
            >
              <CaretLeft width={17} height={17} onClick={() => setPage((p) => Math.max(p - 1, 1))} />
            </div>
            <div
              className="swiper-button-next arrow arrow--right"
              ref={(node) => setNextEl(node)}
            >
              <CaretRight width={17} height={17} onClick={() =>{
                if(hasMore > 0)  setPage((p) => p + 1)
              } } />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ProductList);
