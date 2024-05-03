'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css';
import { AnimeInfo, CharacterRes, ICharacter } from '@/types/site';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Swiper as SwiperType } from 'swiper';
import { Tooltip } from '@nextui-org/react';

export const Characters = ({ characters }: { characters: CharacterRes }) => {
  const characterSet = new Set();
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const swiperRef = useRef<SwiperType>();

  return (
    <div>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        modules={[Navigation, Mousewheel]}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        navigation={{ enabled: true }}
        style={{
          // @ts-ignore
          '--swiper-navigation-color': 'rgba(0,0,0,0)',
        }}
        mousewheel={{ enabled: true }}
        breakpoints={{
          100: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 5 },
        }}
      >
        <div className="mr-4 mt-2 flex items-end justify-end gap-3 text-2xl">
          <button
            className="cursor-pointer duration-200 hover:fill-slate-400"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaArrowLeft />
          </button>
          <button
            className="cursor-pointer duration-200 hover:fill-slate-400"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <FaArrowRight />
          </button>
        </div>
        {characters.characters.map((c, i) => {
          if (
            !characterSet.has(c.voiceActor.name) &&
            !characterSet.has(c.name)
          ) {
            characterSet.add(c.voiceActor.name);
            characterSet.add(c.name);
            return (
              <SwiperSlide
                key={c.name}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(-1)}
              >
                <Tooltip
                  color="success"
                  content={
                    <p>
                      Character: {c.name}
                      <br />
                      Voice Actor: {c.voiceActor.name}
                    </p>
                  }
                >
                  <div className="avatar relative">
                    {c.image ? (
                      <Image
                        src={
                          hoveredIndex === i
                            ? c.voiceActor.image
                              ? c.voiceActor.image
                              : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png'
                            : c.image
                        }
                        alt={c.name}
                        width={2000}
                        height={2000}
                        className="max-h-[128px] min-h-[128px] min-w-[128px] max-w-[128px] rounded-full object-cover"
                      />
                    ) : null}
                  </div>
                </Tooltip>
              </SwiperSlide>
            );
          } else {
            return null;
          }
        })}
      </Swiper>
    </div>
  );
};
