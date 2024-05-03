import { getInfo, getEpisodes, getCharacters } from '@/functions/requests';
import { AnimeInfo, CharacterRes } from '@/types/site';
import React, { use } from 'react';
import { InfoImg } from './Img';
import { Button, Chip, Image, Tooltip } from '@nextui-org/react';
import { GenerateColoredElementByStatus } from '@/functions/jsxUtilityFunctions';
import { FaPlayCircle } from 'react-icons/fa';
import { AccordionComponent } from './Accordions';
import Link from 'next/link';

interface Params {
  id: string;
}

const Info: React.FC<{ params: Params }> = ({ params }) => {
  const infoPromise = getInfo(params.id) as Promise<AnimeInfo>;
  const episodesPromise = getEpisodes(params.id);
  const charactersPromise = getCharacters(params.id) as Promise<CharacterRes>;

  const [info, episodes, characters] = use(
    Promise.all([infoPromise, episodesPromise, charactersPromise])
  );

  return (
    <>
      <div className="relative">
        <InfoImg info={info} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080006]">
          <div className="ml-5 flex flex-col h-full justify-end">
            <div className="flex flex-col gap-4 lg:flex-row items-center">
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
                      className="text-center md:text-left lg:text-left text-3xl font-bold"
                    >
                      {info.title.english}
                    </h1>
                    <h2 className="text-center md:text-left lg:text-left text-2xl font-semibold">
                      {info.title.romaji}
                    </h2>
                    <div className="text-xl font-semibold text-center md:text-left lg:text-left">
                      {
                        <GenerateColoredElementByStatus
                          status={info.status ?? 'NOT_YET_RELEASED'}
                        />
                      }
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start lg:justify-start mb-4">
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
                              <div className="flex gap-1 items-center">
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
                            <div className="flex gap-1 items-center">
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
      <div className="mt-20 ml-5">
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
