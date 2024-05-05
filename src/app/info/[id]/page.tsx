import { getInfo, getEpisodes, getCharacters } from '@/functions/requests';
import { AnimeInfo, CharacterRes } from '@/types/site';
import React, { use } from 'react';
import { InfoImg } from './Img';
import { Button, Chip, Image, Tooltip } from '@nextui-org/react';
import { GenerateColoredElementByStatus } from '@/functions/jsxUtilityFunctions';
import { FaPlayCircle } from 'react-icons/fa';
import { AccordionComponent } from './Accordions';
import Link from 'next/link';
import { Metadata, Viewport } from 'next';

export async function generateMetadata({
  params,
}: Readonly<{ params: { id: string } }>): Promise<Metadata> {
  const info = (await getInfo(params.id)) as AnimeInfo;
  return {
    title: info
      ? `${info?.title.english ? info.title.english : info.title.romaji}`
      : 'Loading...',
    description: info
      ? `${info.description.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 180)}...`
      : 'Loading...',
    openGraph: {
      images: info ? info.coverImage : 'No image',
    },
  };
}

export async function generateViewport({
  params,
}: Readonly<{ params: { id: string } }>): Promise<Viewport> {
  const info = (await getInfo(params.id)) as AnimeInfo;
  return {
    themeColor: info.color ? info.color : '#000000',
  };
}

interface Params {
  id: string;
}

const Info: React.FC<{ params: Params }> = ({ params }) => {
  const infoPromise = getInfo(params.id) as Promise<AnimeInfo>;
  const episodesPromise = getEpisodes(params.id);
  const charactersPromise = getCharacters(params.id) as Promise<CharacterRes>;

  const [info, episodes, characters] = use(
    Promise.all([infoPromise, episodesPromise, charactersPromise]),
  );

  return (
    <>
      <div className="relative">
        <InfoImg info={info} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080006]">
          <div className="ml-5 flex h-full flex-col justify-end">
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <Image
                src={info.bannerImage}
                alt={info.title.english ?? info.title.romaji}
                width={300}
                height={500}
              />
              <div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h1
                      style={{ color: info.color ?? 'pink' }}
                      className="text-center text-3xl font-bold md:text-left lg:text-left"
                    >
                      {info.title.english}
                    </h1>
                    <h2 className="text-center text-2xl font-semibold md:text-left lg:text-left">
                      {info.title.romaji}
                    </h2>
                    <div className="text-center text-xl font-semibold md:text-left lg:text-left">
                      {
                        <GenerateColoredElementByStatus
                          status={info.status ?? 'NOT_YET_RELEASED'}
                        />
                      }
                    </div>
                    <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start lg:justify-start">
                      {info.genres.map((g) => {
                        return (
                          <Chip key={g} color={'primary'}>
                            {g}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex w-full justify-center md:justify-start lg:justify-start">
                    <div className="flex flex-row gap-3">
                      <Tooltip
                        placement="top"
                        color={episodes?.length! > 0 ? 'success' : 'secondary'}
                        content={
                          episodes?.length! > 0
                            ? `${episodes?.[0].title}`
                            : 'No episodes available'
                        }
                      >
                        <div
                          className={`${
                            episodes?.length! > 0 ? '' : 'cursor-no-drop'
                          }`}
                        >
                          <Link
                            href={
                              episodes?.length! > 0
                                ? `/watch/${params.id}/1`
                                : '#'
                            }
                            className={`${
                              episodes?.length! > 0 ? '' : 'cursor-no-drop'
                            }`}
                          >
                            <Button
                              isDisabled={episodes?.length! > 0 ? false : true}
                              className={`max-w-[120px] ${
                                episodes?.length! > 0
                                  ? 'cursor-pointer'
                                  : 'cursor-no-drop'
                              }`}
                              color={
                                episodes?.length! > 0 ? 'success' : 'secondary'
                              }
                            >
                              <div className="flex items-center gap-1">
                                <FaPlayCircle /> <span>Watch Now</span>
                              </div>
                            </Button>
                          </Link>
                        </div>
                      </Tooltip>
                      <Tooltip
                        placement="top"
                        color="danger"
                        content="Not yet implemented"
                      >
                        <div className="cursor-no-drop">
                          <Button
                            isDisabled
                            className="max-w-[120px]"
                            color={'danger'}
                          >
                            <div className="flex items-center gap-1">
                              <span>Add to list</span>
                            </div>
                          </Button>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-5 mt-20">
        {episodes?.length! > 0 ? (
          <AccordionComponent
            info={info}
            characters={characters}
            episodes={episodes}
            id={params.id}
          />
        ) : (
          <AccordionComponent
            info={info}
            characters={characters}
            id={params.id}
          />
        )}
      </div>
    </>
  );
};

export default Info;
