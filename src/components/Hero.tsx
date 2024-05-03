'use client';

import { getRandom, numberToMonth } from '@/functions/utilityFunctions';
import { ConsumetAnime, ConsumetAnimePage } from '@/types/consumet';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import RenderVideo from './Video';
import { GenerateColoredElementByStatus } from '@/functions/jsxUtilityFunctions';
import { FaCalendarAlt, FaPlayCircle } from 'react-icons/fa';
import { Button } from '@nextui-org/react';

export const Hero = ({ data }: { data: ConsumetAnimePage }) => {
  const [trailer, setTrailer] = useState<any>();
  const [randomAnime, setRandomAnime] = useState<ConsumetAnime>();

  useEffect(() => {
    setRandomAnime(getRandom(...data.results));
  }, [data.results]);

  useEffect(() => {
    async function fetchTrailer(trailerId: string) {
      try {
        const response = await fetch(
          `https://pipedapi.kavin.rocks/streams/${trailerId}`
        );
        const { videoStreams } = await response.json();
        const item = videoStreams.find(
          (i: any) => i.quality === '1080p' && i.format === 'WEBM'
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

  return (
    <>
      {randomAnime ? (
        <div>
          <div className="relative">
            {trailer && trailer.url ? (
              <RenderVideo trailer={trailer.url} />
            ) : (
              <>
                <Image
                  draggable={false}
                  src={randomAnime.cover}
                  alt={randomAnime.title.english ?? randomAnime.title.romaji}
                  width={1920}
                  height={920}
                />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080006]">
              <div className="ml-5 flex flex-col gap-8 h-full justify-end">
                <div>
                  <h3 style={{ color: randomAnime.color ?? 'pink' }}>
                    {randomAnime.title.native}
                  </h3>
                  <h1 className="lg:text-7xl text-3xl line-clamp-2 max-w-[70%] lg:max-w-[55%] font-bold">
                    {randomAnime.title.english ?? randomAnime.title.romaji}
                  </h1>
                </div>
                <div className="flex gap-3 lg:gap-8 text-lg lg:text-2xl font-semibold">
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
                  className="lg:line-clamp-4 md:line-clamp-3 text-xl max-w-[70%] hidden"
                  dangerouslySetInnerHTML={{ __html: randomAnime.description }}
                />
              </div>
              <Button className="ml-5" color={'primary'}>
                <FaPlayCircle /> <span>Watch Now</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
