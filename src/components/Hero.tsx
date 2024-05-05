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

export const Hero = ({ data }: { data: ConsumetAnimePage }) => {
  const [trailer, setTrailer] = useState<any>();
  const [randomAnime, setRandomAnime] = useState<ConsumetAnime>();
  const [episodes, setEpisodes] = useState<SiteEpisode[] | undefined | null>(
    null,
  );

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
                  dangerouslySetInnerHTML={{ __html: randomAnime.description }}
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
                    episodes?.length! > 0 ? `/watch/${randomAnime.id}/1` : '#'
                  }`}
                  className={`${
                    episodes?.length! > 0 ? 'cursor-no-drop' : 'cursor-pointer'
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
        <div></div>
      )}
    </>
  );
};
