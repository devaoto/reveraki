'use client';

import { getRandom, numberToMonth } from '@/functions/utilityFunctions';
import { ConsumetAnime, ConsumetAnimePage } from '@/types/consumet';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import RenderVideo from './Video';
import { GenerateColoredElementByStatus } from '@/functions/jsxUtilityFunctions';
import { FaCalendarAlt, FaPlayCircle } from 'react-icons/fa';
import { Button, Link, Tooltip } from '@nextui-org/react';
import { SiteEpisode } from '@/types/site';
import { getEpisodes } from '@/functions/clientRequests';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import './slider.css';
import 'swiper/css/pagination';
import { MdStarRate } from 'react-icons/md';
import { PiTelevisionBold } from 'react-icons/pi';

const Hero = ({ data }: { data: ConsumetAnimePage }) => {
  const [trailer, setTrailer] = useState<any>();
  const [randomAnime, setRandomAnime] = useState<ConsumetAnime>();
  const [episodes, setEpisodes] = useState<SiteEpisode[] | undefined | null>(
    null,
  );
  const [isTrailerEnabled, setIsTrailerEnabled] = useState<boolean>(true);

  useEffect(() => {
    setIsTrailerEnabled(localStorage.getItem('homeTrailer') === 'on');
  }, []);

  useEffect(() => {
    setRandomAnime(getRandom(...data.results));
  }, [data.results]);

  useEffect(() => {
    async function fetchTrailer(trailerId: string) {
      try {
        const response = await fetch(
          `https://pipedapi.kavin.rocks/streams/${trailerId}`,
        );
        const { videoStreams } = await response.json();
        const item = videoStreams.find(
          (i: any) => i.quality === '1080p' && i.format === 'WEBM',
        );

        setTrailer(item);
      } catch (error) {
        console.error('Error fetching trailer:', error);
        setTrailer(undefined);
      }
    }

    if (randomAnime?.trailer.id) {
      fetchTrailer(randomAnime.trailer.id);
    }
  }, [randomAnime?.trailer.id]);

  useEffect(() => {
    async function fetchEpisodes(id: string) {
      try {
        setEpisodes(await getEpisodes(id));
      } catch (error) {
        console.error('Error fetching episodes:', error);
        setEpisodes(undefined);
      }
    }

    if (randomAnime?.id) {
      fetchEpisodes(randomAnime.id);
    }
  }, [randomAnime?.id]);

  return (
    <>
      {randomAnime ? (
        <>
          {isTrailerEnabled ? (
            <div>
              <div className="relative">
                {trailer && trailer.url ? (
                  <RenderVideo trailer={trailer.url} />
                ) : (
                  <>
                    <Image
                      draggable={false}
                      src={randomAnime.cover}
                      alt={
                        randomAnime.title.english ?? randomAnime.title.romaji
                      }
                      width={1920}
                      height={920}
                    />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent from-[80%] to-background"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent from-[80%] to-background"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background">
                  <div className="ml-5 flex h-full flex-col justify-end gap-8">
                    <div>
                      <h3 style={{ color: randomAnime.color ?? 'pink' }}>
                        {randomAnime.title.native}
                      </h3>
                      <h1 className="line-clamp-2 max-w-[70%] text-3xl font-bold lg:max-w-[55%] lg:text-7xl">
                        {randomAnime.title.english ?? randomAnime.title.romaji}
                      </h1>
                    </div>
                    <div className="flex gap-3 text-lg font-semibold lg:gap-8 lg:text-2xl">
                      <p>{randomAnime.type}</p>
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt />
                        <p>
                          {randomAnime.startDate.day}{' '}
                          {numberToMonth(randomAnime.startDate.month)}{' '}
                          {randomAnime.startDate.year}
                        </p>
                      </div>
                      <p>
                        <GenerateColoredElementByStatus
                          status={randomAnime.status}
                        />
                      </p>
                    </div>
                    <p
                      className="hidden max-w-[70%] text-xl md:line-clamp-3 lg:line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html: randomAnime.description,
                      }}
                    />
                  </div>
                  <Tooltip
                    placement="top"
                    color={episodes?.length! > 0 ? 'primary' : 'secondary'}
                    content={
                      episodes?.length! > 0
                        ? `${episodes?.[0].title}`
                        : 'No episode available'
                    }
                  >
                    <Link
                      href={`${
                        episodes?.length! > 0
                          ? `/watch/${randomAnime.id}/1`
                          : '#'
                      }`}
                      className={`${
                        episodes?.length! > 0
                          ? 'cursor-no-drop'
                          : 'cursor-pointer'
                      }`}
                    >
                      <Button
                        className="ml-5"
                        color={episodes?.length! > 0 ? 'primary' : 'secondary'}
                      >
                        <FaPlayCircle /> <span>Watch Now</span>
                      </Button>
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Swiper
                style={{
                  // @ts-ignore
                  '--swiper-navigation-color': '#fff',
                  '--swiper-pagination-color': '#fff',
                }}
                grabCursor={true}
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                spaceBetween={10}
                autoplay={{ disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="my-4"
              >
                {data.results.map((anime) => {
                  return (
                    <SwiperSlide key={anime.id}>
                      <div className="relative h-80 w-full md:h-96 lg:h-[600px]">
                        <Image
                          src={anime.cover}
                          alt={anime.title.english}
                          width={5000}
                          height={5000}
                          className="h-full w-full rounded-lg object-cover"
                          priority={true}
                        />
                        <div className="absolute inset-0 flex items-center gap-36 bg-opacity-50 bg-gradient-to-br from-black/75 from-25% p-4">
                          <div className="flex flex-col justify-center">
                            <h1
                              style={{ color: anime.color }}
                              className={`text-sm lg:text-xl`}
                            >
                              {anime.title.native}
                            </h1>
                            <h1 className="text-xl font-semibold text-white lg:text-7xl">
                              {anime.title.english
                                ? `${anime.title.english}`
                                : `${anime.title.romaji}`}
                            </h1>
                            <div className="flex gap-3 text-lg font-semibold lg:gap-8 lg:text-2xl">
                              <p>{anime.type}</p>
                              <div className="flex items-center gap-1">
                                <FaCalendarAlt />
                                <p>
                                  {anime.startDate.day}{' '}
                                  {numberToMonth(anime.startDate.month)}{' '}
                                  {anime.startDate.year}
                                </p>
                              </div>
                              <p>
                                <GenerateColoredElementByStatus
                                  status={anime.status}
                                />
                              </p>
                            </div>
                            <p
                              className="hidden max-w-[70%] text-xl md:line-clamp-3 lg:line-clamp-4"
                              dangerouslySetInnerHTML={{
                                __html: anime.description,
                              }}
                            />
                            <Link href={`/watch/${anime.id}/1`}>
                              <Button
                                color="primary"
                                className="flex items-center justify-center gap-1"
                              >
                                <FaPlayCircle /> <span>Watch Now</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Hero;

