'use client';

import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './slider.css';
import { ConsumetAnimePage } from '@/types/consumet';
import { useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { GenerateColoredElementByStatus } from '@/functions/jsxUtilityFunctions';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Image, Tooltip } from '@nextui-org/react';

export const Cards = ({ data }: { data: ConsumetAnimePage }) => {
  const swiperRef = useRef<SwiperType>();
  const [showButtons, setShowButtons] = useState(false);
  const [showPreviousButton, setShowPreviousButton] = useState(false);

  const handleMouseEnter = () => {
    setShowButtons(true);
  };

  const handleMouseLeave = () => {
    setShowButtons(false);
  };

  const handleSlideChange = () => {
    setShowPreviousButton(true);
  };

  const handleNextButtonClick = () => {
    setShowPreviousButton(true);
    swiperRef.current?.slideNext();
  };

  const handlePreviousButtonClick = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        <Swiper
          modules={[Navigation, Mousewheel]}
          mousewheel={{ enabled: true }}
          navigation={{ enabled: false }}
          centeredSlides={false}
          spaceBetween={20}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          style={{
            // @ts-ignore
            '--swiper-navigation-color': 'rgba(0, 0, 0, 0)',
          }}
          onSlideChange={handleSlideChange}
          breakpoints={{
            100: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 5 },
          }}
        >
          {data.results.map((anime) => (
            <SwiperSlide key={anime.id}>
              <Link href={`/info/${anime.id}`}>
                <motion.div
                  className="rounded-lg"
                  whileHover={{
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {anime.image && (
                    <motion.div>
                      <Image
                        isZoomed
                        src={anime.image}
                        alt={anime.title.english ?? anime.title.romaji}
                        width={300}
                        height={500}
                        className="max-h-[330px] min-h-[330px] object-cover lg:max-h-[400px] lg:min-h-[400px]"
                      />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
              <Tooltip
                color="success"
                content={anime.title.english ?? anime.title.romaji}
              >
                <h1
                  className="mt-2 line-clamp-1 text-left text-lg font-medium"
                  style={{ color: anime.color ?? '#326d6c' }}
                >
                  {anime.title.english ?? anime.title.romaji}
                </h1>
              </Tooltip>
              <div className="flex gap-2 text-sm font-semibold">
                <Tooltip
                  color="primary"
                  content="Total Episodes"
                  placement="right-end"
                >
                  {anime?.totalEpisodes ?? 0}
                </Tooltip>{' '}
                |{' '}
                <Tooltip placement="top" color="success" content="Status">
                  <GenerateColoredElementByStatus
                    status={anime?.status ?? 'NOT_YET_RELEASED'}
                  />
                </Tooltip>{' '}
                |{' '}
                <Tooltip placement="top" color="danger" content="Type">
                  {anime?.type === 'TV' ? 'ANIME' : anime.type}
                </Tooltip>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {showButtons && (
          <div className="absolute left-0 right-0 top-1/2 hidden -translate-y-1/2 transform justify-between">
            {showPreviousButton && (
              <motion.button
                className="cursor-pointer text-2xl duration-200 hover:fill-slate-400"
                onClick={handlePreviousButtonClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background:
                    'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1))',
                  minHeight: '310px',
                  width: '30px',
                  borderRadius: 'inherit',
                }}
              >
                <FaArrowLeft />
              </motion.button>
            )}
            <motion.button
              className="cursor-pointer text-2xl duration-200 hover:fill-slate-400"
              onClick={handleNextButtonClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background:
                  'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))',
                minHeight: '310px',
                width: '30px',
                borderRadius: 'inherit',
              }}
            >
              <FaArrowRight />
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
};

